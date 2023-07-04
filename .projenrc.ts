import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';
import { DependencyType, ReleasableCommits } from 'projen';

const MAJOR_VERSION = 2;
const releaseWorkflowName = `release-awscli-v${MAJOR_VERSION}`;
const defaultReleaseBranchName = `awscli-v${MAJOR_VERSION}/main`;

const project = new CdklabsConstructLibrary({
  setNodeEngineVersion: false,
  stability: 'stable',
  private: false,
  projenrcTs: true,
  author: 'Amazon Web Services, Inc.',
  authorAddress: 'aws-cdk-dev@amazon.com',
  cdkVersion: '2.0.0',
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  name: `@aws-cdk/asset-awscli-v${MAJOR_VERSION}`,
  description: 'An Asset construct that contains the AWS CLI, for use in Lambda Layers',
  repositoryUrl: 'https://github.com/cdklabs/awscdk-asset-awscli.git',
  homepage: 'https://github.com/cdklabs/awscdk-asset-awscli#readme',
  autoApproveOptions: {
    allowedUsernames: ['aws-cdk-automation', 'dependabot[bot]', 'mergify[bot]'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: [
        // support all awscli branches from the default branch
        'awscli-v1/main',
        'awscli-v2/main',
      ],
    },
  },
  majorVersion: 2,
  releaseTagPrefix: `awscli-v${MAJOR_VERSION}`,
  releaseWorkflowName: releaseWorkflowName,
  defaultReleaseBranch: defaultReleaseBranchName,
  // If we don't do this we release the devDependency updates that happen every day, which blows out
  // our PyPI storage budget even though there aren't any functional changes.
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  workflowNodeVersion: '16.x',
  minNodeVersion: '16.0.0',
  jsiiVersion: '^5',
  publishToPypi: {
    distName: `aws-cdk.asset-awscli-v${MAJOR_VERSION}`,
    module: `aws_cdk.asset_awscli_v${MAJOR_VERSION}`,
  },
  publishToMaven: {
    javaPackage: `software.amazon.awscdk.cdk.asset.awscli.v${MAJOR_VERSION}`,
    mavenGroupId: 'software.amazon.awscdk',
    mavenArtifactId: `cdk-asset-awscli-v${MAJOR_VERSION}`,
    mavenEndpoint: 'https://aws.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: `Amazon.CDK.Asset.AwsCliV${MAJOR_VERSION}`,
    packageId: `Amazon.CDK.Asset.AwsCliV${MAJOR_VERSION}`,
  },
  publishToGo: {
    moduleName: 'github.com/cdklabs/awscdk-asset-awscli-go',
    packageName: `awscliv${MAJOR_VERSION}`,
    gitBranch: `awscli.${MAJOR_VERSION}`,
    gitUserName: 'AWS CDK Team',
    gitUserEmail: 'aws-cdk@amazon.com',
    githubTokenSecret: 'PROJEN_GITHUB_TOKEN',
  },
});

// We need a newer version of aws-cdk-lib testing.
project.deps.addDependency('constructs@^10.0.5', DependencyType.DEVENV);
project.deps.addDependency('aws-cdk-lib@^2.40.0', DependencyType.DEVENV);
project.deps.addDependency('jsii-rosetta@^5', DependencyType.DEVENV);

project.preCompileTask.exec('layer/build.sh');

project.synth();
