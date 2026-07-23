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
        uint256 issuerKey = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
        address issuer = vm.addr(issuerKey);

        vm.startBroadcast();

        DNCAccessControl accessControl = new DNCAccessControl(deployer);

        accessControl.grantEducationRole(issuer);
        accessControl.grantScienceTechRole(issuer);
        accessControl.grantAuthorityRole(issuer);

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

        console.log("");
        console.log("Account #0 (deployer): DEFAULT_ADMIN_ROLE only");
        console.log("Account #1 (issuer):   EDUCATION_ROLE + SCIENCE_TECH_ROLE + AUTHORITY_ROLE");
        console.log("Account #2 (citizen):  no role");
    }
}
