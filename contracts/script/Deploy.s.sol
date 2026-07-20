pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/DNCAccessControl.sol";
import "../src/DNCProofRegistry.sol";
import "../src/DNCUniversityDegree.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        DNCAccessControl accessControl = new DNCAccessControl(deployer);

        DNCProofRegistry registry = new DNCProofRegistry(
            address(accessControl)
        );

        DNCUniversityDegree degree = new DNCUniversityDegree(
            address(accessControl),
            "DNC University Degree",
            "DNCD"
        );

        vm.stopBroadcast();

        console.log("=== DNC-CertiTrust Deployment ===");
        console.log("Network: Arbitrum Sepolia");
        console.log("Deployer:", deployer);
        console.log("DNCAccessControl:", address(accessControl));
        console.log("DNCProofRegistry:", address(registry));
        console.log("DNCUniversityDegree:", address(degree));
    }
}

contract DeployLocalScript is Script {
    function run() external {
        address deployer = msg.sender;

        vm.startBroadcast();

        DNCAccessControl accessControl = new DNCAccessControl(deployer);

        accessControl.grantEducationRole(deployer);
        accessControl.grantScienceTechRole(deployer);

        DNCProofRegistry registry = new DNCProofRegistry(
            address(accessControl)
        );

        DNCUniversityDegree degree = new DNCUniversityDegree(
            address(accessControl),
            "DNC University Degree",
            "DNCD"
        );

        vm.stopBroadcast();

        console.log("=== DNC-CertiTrust Local Deployment ===");
        console.log("DNCAccessControl:", address(accessControl));
        console.log("DNCProofRegistry:", address(registry));
        console.log("DNCUniversityDegree:", address(degree));

        console.log("Roles granted to deployer:");
        console.log("  DEFAULT_ADMIN_ROLE: true");
        console.log("  EDUCATION_ROLE: true");
        console.log("  SCIENCE_TECH_ROLE: true");
    }
}
