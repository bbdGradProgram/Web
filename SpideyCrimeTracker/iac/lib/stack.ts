import * as cdk from 'aws-cdk-lib';
import {
    aws_ec2 as ec2,
    aws_elasticbeanstalk as elb,
    aws_iam as iam,
    aws_rds as rds,
    aws_s3_assets as s3Assets
} from 'aws-cdk-lib';
import {Construct} from "constructs";
import {Effect, PolicyDocument, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {GitHubStackProps} from "./githubStackProps";
import {CfnEnvironment} from "aws-cdk-lib/aws-elasticbeanstalk";
import OptionSettingProperty = CfnEnvironment.OptionSettingProperty;

export class Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: GitHubStackProps) {
        super(scope, id, props);

        const appName = "spidey-crime-tracker"

        const vpc = new ec2.Vpc(this, `${appName}-vpc`, {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: "SpideyCrimeTrackerPublicSubnet",
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ],
        });

        const securityGrouup = new ec2.SecurityGroup(this, `${appName}-sg`, {
            vpc,
            allowAllOutbound: false,
        });

        securityGrouup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(1433));
        securityGrouup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(1433));

        const dbInstance = new rds.DatabaseInstance(this, `${appName}-db-instance`, {
            engine: rds.DatabaseInstanceEngine.sqlServerEx({
                version: rds.SqlServerEngineVersion.VER_16,
            }),
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T3,
                ec2.InstanceSize.MICRO
            ),
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            allocatedStorage: 20,
            publiclyAccessible: true,
            deletionProtection: false,
            credentials: rds.Credentials.fromGeneratedSecret("admin", {
                secretName: `${appName}-db-secret`,
            }),
            securityGroups: [securityGrouup],
        });

        // Create elastic beanstalk
        const elbZipArchive = new s3Assets.Asset(this, `${appName}-api-zip`, {
            path: `${__dirname}/../../api`,
        });

        const elbApp = new elb.CfnApplication(this, `${appName}-elasticbeanstalk`, {
            applicationName: appName
        });
        const appVersionProps = new elb.CfnApplicationVersion(this, `${appName}-app-version`, {
            applicationName: appName,
            sourceBundle: {
                s3Bucket: elbZipArchive.s3BucketName,
                s3Key: elbZipArchive.s3ObjectKey,
            },
        });

        appVersionProps.addDependency(elbApp);

        const elbWebTierPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
        const elbRole = new iam.Role(this, `${appName}-elasticbeanstalk-ec2-role`, {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [elbWebTierPolicy],
        });


        const instanceProfileName = `${appName}-instance-profile`

        const instanceProfile = new iam.CfnInstanceProfile(this, instanceProfileName, {
            instanceProfileName: instanceProfileName,
            roles: [
                elbRole.roleName
            ]
        });
        const optionSettingProperties: OptionSettingProperty[] = [
            {
                namespace: 'aws:autoscaling:launchconfiguration',
                optionName: 'IamInstanceProfile',
                value: instanceProfileName,
            },
            {
                namespace: 'aws:autoscaling:asg',
                optionName: 'MaxSize',
                value: '1',
            },
            {
                namespace: 'aws:ec2:instances',
                optionName: 'InstanceTypes',
                value: 't3.micro',
            },
            {
                namespace: 'aws:ec2:vpc',
                optionName: 'VPCId',
                value: vpc.vpcId,
            },
            {
                namespace: 'aws:ec2:vpc',
                optionName: 'Subnets',
                value: vpc.publicSubnets.map((subnet) => subnet.subnetId).join(",")
            },
            {
                namespace: 'aws:elasticbeanstalk:application:environment',
                optionName: 'PORT',
                value: '3000'
            },
        ];

        const elbEnv = new elb.CfnEnvironment(this, `${appName}-env`, {
            environmentName: `${appName}-environment`,
            applicationName: appName,
            solutionStackName: '64bit Amazon Linux 2023 v6.1.3 running Node.js 20',
            optionSettings: optionSettingProperties,
            versionLabel: appVersionProps.ref,
        });

        // Create elastic beanstalk frontend
        const webAppName = `${appName}-web`
        const elbFeZipArchive = new s3Assets.Asset(this, `${webAppName}-zip`, {
            path: `${__dirname}/../../web`,
        });

        const elbFeApp = new elb.CfnApplication(this, `${webAppName}-elasticbeanstalk`, {
            applicationName: webAppName
        });
        const appVersionPropsFe = new elb.CfnApplicationVersion(this, `${webAppName}-app-version`, {
            applicationName: webAppName,
            sourceBundle: {
                s3Bucket: elbFeZipArchive.s3BucketName,
                s3Key: elbFeZipArchive.s3ObjectKey,
            },
        });

        appVersionPropsFe.addDependency(elbFeApp);

        const elbFeWebTierPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')

        const instanceProfileNameFe = `${webAppName}-instance-profile`

        const instanceProfileFe = new iam.CfnInstanceProfile(this, instanceProfileNameFe, {
            instanceProfileName: instanceProfileNameFe,
            roles: [
                elbRole.roleName
            ]
        });
        const optionSettingPropertiesFe: OptionSettingProperty[] = [
            {
                namespace: 'aws:autoscaling:launchconfiguration',
                optionName: 'IamInstanceProfile',
                value: instanceProfileNameFe,
            },
            {
                namespace: 'aws:autoscaling:asg',
                optionName: 'MaxSize',
                value: '1',
            },
            {
                namespace: 'aws:ec2:instances',
                optionName: 'InstanceTypes',
                value: 't3.micro',
            },
            {
                namespace: 'aws:ec2:vpc',
                optionName: 'VPCId',
                value: vpc.vpcId,
            },
            {
                namespace: 'aws:ec2:vpc',
                optionName: 'Subnets',
                value: vpc.publicSubnets.map((subnet) => subnet.subnetId).join(",")
            },
            {
                namespace: 'aws:elasticbeanstalk:application:environment',
                optionName: 'PORT',
                value: '3001'
            },
        ];

        const elbEnvFe = new elb.CfnEnvironment(this, `${webAppName}-env`, {
            environmentName: `${webAppName}`,
            applicationName: webAppName,
            solutionStackName: '64bit Amazon Linux 2023 v6.1.3 running Node.js 20',
            optionSettings: optionSettingPropertiesFe,
            versionLabel: appVersionPropsFe.ref,
        });

        // Create role for github actions to assume
        const githubDomain = "token.actions.githubusercontent.com";

        const ghProvider = new iam.OpenIdConnectProvider(this, "githubProvider", {
            url: `https://${githubDomain}`,
            clientIds: ["sts.amazonaws.com"],
        });

        const iamRepoDeployAccess = props?.repositoryConfig.map(
            (r) => `repo:${r.owner}/${r.repo}:*`
        );

        const conditions: iam.Conditions = {
            StringLike: {
                [`${githubDomain}:sub`]: iamRepoDeployAccess,
            },
        };

        const elbUpdatesPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy')

        new iam.Role(this, `${appName}-deploy-role`, {
            assumedBy: new iam.WebIdentityPrincipal(
                ghProvider.openIdConnectProviderArn,
                conditions
            ),
            inlinePolicies: {
                "allowAssumeCDKRoles": new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ["sts:AssumeRole"],
                            effect: Effect.ALLOW,
                            resources: ["arn:aws:iam::*:role/cdk-*"]
                        }),
                        new PolicyStatement({
                            actions: ["secretsmanager:GetSecretValue"],
                            effect: Effect.ALLOW,
                            resources: ["*"]
                        })
                    ],
                }),
            },
            managedPolicies: [elbWebTierPolicy, elbUpdatesPolicy],
            roleName: 'SpideyCrimeTrackerDeployRole',
            description:
                'This role is used via GitHub Actions to deploy with AWS CDK',
            maxSessionDuration: cdk.Duration.hours(1),
        });
    }
}
