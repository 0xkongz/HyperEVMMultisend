// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title MultiSender
 * @dev Send ETH or ERC20 tokens to multiple addresses in one transaction
 */
contract MultiSender {
    address public owner;
    bool private locked;

    event NativeTokensSent(address indexed sender, uint256 totalAmount, uint256 recipientCount);
    event ERC20TokensSent(address indexed sender, address indexed token, uint256 totalAmount, uint256 recipientCount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Send native tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send (in wei)
     */
    function multiSendNative(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length > 0, "Empty arrays");
        require(recipients.length <= 200, "Too many recipients");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value >= totalAmount, "Insufficient value sent");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be > 0");

            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }

        // Refund excess
        if (msg.value > totalAmount) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalAmount}("");
            require(refundSuccess, "Refund failed");
        }

        emit NativeTokensSent(msg.sender, totalAmount, recipients.length);
    }

    /**
     * @dev Send ERC20 tokens to multiple addresses
     * @param token ERC20 token address
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send
     */
    function multiSendERC20(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        require(token != address(0), "Invalid token");
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length > 0, "Empty arrays");
        require(recipients.length <= 200, "Too many recipients");

        IERC20 tokenContract = IERC20(token);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        // Transfer total amount to contract first
        require(
            tokenContract.transferFrom(msg.sender, address(this), totalAmount),
            "Initial transfer failed"
        );

        // Distribute to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be > 0");

            require(
                tokenContract.transfer(recipients[i], amounts[i]),
                "Transfer failed"
            );
        }

        emit ERC20TokensSent(msg.sender, token, totalAmount, recipients.length);
    }

    /**
     * @dev Send same amount of native tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amount Amount to send to each recipient (in wei)
     */
    function multiSendNativeEqual(
        address[] calldata recipients,
        uint256 amount
    ) external payable nonReentrant {
        require(recipients.length > 0, "Empty array");
        require(recipients.length <= 200, "Too many recipients");
        require(amount > 0, "Amount must be > 0");

        uint256 totalAmount = amount * recipients.length;
        require(msg.value >= totalAmount, "Insufficient value sent");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");

            (bool success, ) = recipients[i].call{value: amount}("");
            require(success, "Transfer failed");
        }

        // Refund excess
        if (msg.value > totalAmount) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalAmount}("");
            require(refundSuccess, "Refund failed");
        }

        emit NativeTokensSent(msg.sender, totalAmount, recipients.length);
    }

    /**
     * @dev Send same amount of ERC20 tokens to multiple addresses
     * @param token ERC20 token address
     * @param recipients Array of recipient addresses
     * @param amount Amount to send to each recipient
     */
    function multiSendERC20Equal(
        address token,
        address[] calldata recipients,
        uint256 amount
    ) external nonReentrant {
        require(token != address(0), "Invalid token");
        require(recipients.length > 0, "Empty array");
        require(recipients.length <= 200, "Too many recipients");
        require(amount > 0, "Amount must be > 0");

        IERC20 tokenContract = IERC20(token);
        uint256 totalAmount = amount * recipients.length;

        // Transfer total amount to contract first
        require(
            tokenContract.transferFrom(msg.sender, address(this), totalAmount),
            "Initial transfer failed"
        );

        // Distribute to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");

            require(
                tokenContract.transfer(recipients[i], amount),
                "Transfer failed"
            );
        }

        emit ERC20TokensSent(msg.sender, token, totalAmount, recipients.length);
    }

    /**
     * @dev Emergency withdrawal for owner (in case tokens get stuck)
     */
    function emergencyWithdrawNative() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function emergencyWithdrawERC20(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(tokenContract.transfer(owner, balance), "Withdrawal failed");
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    receive() external payable {}
}
