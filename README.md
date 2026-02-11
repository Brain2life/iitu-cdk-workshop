# AWS Cloud Club IITU CDK Workshop

This repository represents AWS Cloud Development Kit (CDK) Immersion Day Workshop to run in your own AWS account. The workshop is organized by [AWS Cloud Club at IITU in Almaty, Kazakhstan](https://www.meetup.com/aws-cloud-club-at-iitu/).

## Workshop Overview

> [!CAUTION]   
> Running this workshop in your AWS Account will inccure some costs for you.   
> After finishig the workshop, don't forget to delete all created resources with `cdk destroy --all`   

The given workshop shows how to develop CDK code in TypeScript to deploy AWS infrastructure components. Including:

## Materials

- [AWS CDK Immersion Day Workshop](https://catalog.workshops.aws/workshops/10141411-0192-4021-afa8-2436f3c66bd8/en-US)

## Workshop Prerequisites

In order to run the workshop, first make sure that you have installed and configured the following packages:
1. [AWS Account with Adminstrator User](https://catalog.workshops.aws/workshops/10141411-0192-4021-afa8-2436f3c66bd8/en-US/20-prerequisites/40-account)
2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured with your AWS account credentials via `aws configure`
3. [NodeJS 22.x or later](https://nodejs.org/en/download/) 
4. TypeScript 3.8 or later
```bash
npm install -g typescript
```
5. Install AWS CDK Toolkit:
```bash
npm install -g aws-cdk
```
To check the installation, run:
```bash
cdk --version
```

For more information, see [AWS CDK prerequisites](https://docs.aws.amazon.com/cdk/v2/guide/prerequisites.html).

## Initial setup

1. Create separate folder for your CDK project that will hold all of your infrastructure code:
```bash
mkdir cdk-workshop && cd cdk-workshop
```
2. To create a new TypeScript CDK Project run:
```bash
cdk init sample-app --language typescript
```
`sample-app` is the name of your CDK project app. You can choose your own CDK app name as you wish.

During app initialization you should see the following message:
```bash
# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdkWorkshopStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
```

As info message says, by default CDK creates an example CDK stack that [**deploys Amazon SQS queue subscribed to SNS topic**](https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html). This is a classic example of a **"fanout" architecture**, allowing messages published to a single SNS topic to be delivered to multiple, independent queues for asynchronous processing. In a few lines of code you provision the following architecture without worrying about deploying and configuration of the underlying components and IAM roles and permissions:

![](./img/cdk_sns_sqs.png)

The main code that defines this stack is in `lib/cdk-workshop-stack.ts`:

![](./img/sns_sqs_code.png)

## CDK Project Structure

The created sample app project structure looks like this:
```bash
cdk-workshop/                 # Root directory of the CDK app
├── bin/
│   └── cdk-workshop.ts       # The execution entry point script for the CDK app
├── lib/                      # Contains the stack definitions (infrastructure code)
│   └── cdk-workshop-stack.ts # Stack definition that defines infrastructure components (SNS and SQS)
├── test/                     # Contains unit tests for the stacks
├── .gitignore                # Specifies files/folders to ignore in Git
├── .npmignore                # Specifies files and directories to exclude when publishing the project as an npm package
├── cdk.json                  # Configuration file for the CDK app
├── jest.config.js            # Configuration for Jest (testing framework)
├── package.json              # Node.js package configuration (dependencies, scripts)
├── package-lock.json         # Lockfile for exact dependency versions (if using npm)
├── README.md                 # Project documentation and setup instructions
├── tsconfig.json             # TypeScript configuration file
```

## CDK Basic Commands

`[STACKS..]` - optional parameter for the names of stacks. For example the name of our initialized CDK stack is `CdkWorkshopStack`.

1. To get help:
```bash
cdk help
```
2. To list all stacks in the app:
```bash
cdk list --all
cdk list [STACKS..]
```
3. To print the CloudFormation YAML template file:
```bash
cdk synthesize [STACKS..]
```
4. To initialize your CDK to work with your AWS account and specific region:
```bash
cdk bootstrap [ENVIRONMENTS..]
```
5. To deploy stack into AWS account:
```bash
cdk deploy [STACKs..]
```
6. To monitor code changes in live deployment:
```bash
cdk watch [STACKS..]
```
7. To delete created stack(s):
```bash
cdk destroy [STACKS..]
```
8. To create a new, empty CDK project from a template:
```bash
cdk init [TEMPLATE_NAME] --language [PROGRAMMING_LANGUAGE]
```

## How CDK works?

CDK code compiles into CloudFormation YAML/JSON template files. Next, CloudFormation deploys the compiled files into AWS.

![](./img/aws_cdk_how_it_workds.png)

To synthesize AWS CloudFormation template file from your CDK code, go to the root of your project and run:
```bash
cdk synth
```

In the CLI output you should see the CloudFormation Template that will be deployed into AWS:
```yaml
esources:
  CdkWorkshopQueue50D9D426:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 300
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: CdkWorkshopStack/CdkWorkshopQueue/Resource
  CdkWorkshopQueuePolicyAF2494A5:
    Type: AWS::SQS::QueuePolicy
    Properties:
      PolicyDocument:
        Statement:
          - Action: sqs:SendMessage
            Condition:
              ArnEquals:
                aws:SourceArn:
                  Ref: CdkWorkshopTopicD368A42F
            Effect: Allow
            Principal:
              Service: sns.amazonaws.com
            Resource:
              Fn::GetAtt:
                - CdkWorkshopQueue50D9D426
                - Arn
        Version: "2012-10-17"
      Queues:
        - Ref: CdkWorkshopQueue50D9D426
    Metadata:
      aws:cdk:path: CdkWorkshopStack/CdkWorkshopQueue/Policy/Resource
  CdkWorkshopQueueCdkWorkshopStackCdkWorkshopTopicD7BE96438B5AD106:
    Type: AWS::SNS::Subscription
    Properties:
      Protocol: sqs
      TopicArn:
        Ref: CdkWorkshopTopicD368A42F
      Endpoint:
        Fn::GetAtt:
          - CdkWorkshopQueue50D9D426
          - Arn
    DependsOn:
      - CdkWorkshopQueuePolicyAF2494A5
    Metadata:
      aws:cdk:path: CdkWorkshopStack/CdkWorkshopQueue/CdkWorkshopStackCdkWorkshopTopicD7BE9643/Resource
  CdkWorkshopTopicD368A42F:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: CdkWorkshopStack/CdkWorkshopTopic/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/1WO0QrCMAxFv8X3NjpBwef9gG6+y9ZWyDab2bSKlP676wqCL8m5hwvJHg4n2G26N0ulRzlhD7H1nRrFom6RnwzxEkwwor7bAus804Tq85MlJsF26behZ+Vw9kg2N/7ylWZU2a6QUsbGMAWn1hs1WY25mYQlbWDg7as6QpW/HBhRumA9Pgw0ZX8B5//lbcEAAAA=
    Metadata:
      aws:cdk:path: CdkWorkshopStack/CDKMetadata/Default
    Condition: CDKMetadataAvailable
Conditions:
  CDKMetadataAvailable:
    Fn::Or:
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - af-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-northeast-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-northeast-2
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-southeast-1
          - Fn::Equals:
              - Ref: AWS::Region
              - ap-southeast-2
          - Fn::Equals:
              - Ref: AWS::Region
              - ca-central-1
          - Fn::Equals:
              - Ref: AWS::Region
              - cn-north-1
          - Fn::Equals:
              - Ref: AWS::Region
              - cn-northwest-1
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-central-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-north-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-1
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-2
          - Fn::Equals:
              - Ref: AWS::Region
              - eu-west-3
          - Fn::Equals:
              - Ref: AWS::Region
              - me-south-1
          - Fn::Equals:
              - Ref: AWS::Region
              - sa-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-east-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-east-2
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - us-west-1
          - Fn::Equals:
              - Ref: AWS::Region
              - us-west-2
Parameters:
  BootstrapVersion:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /cdk-bootstrap/hnb659fds/version
    Description: Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]
```

You can use this command to inspect your infrastructure changes before deploying them into AWS Cloud. For convenience save the output into separate file for inspection:
```bash
cdk synth > cdk_cfn_output.yaml
```

## Bootstrapping an Environment

Before deploying any resources into AWS Cloud with CDK, first you have to prepare the [**bootstrap environment**](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) for CDK. This environment is comprised of foundational AWS components required for CDK functioning:
- **S3 bucket** to store CloudFormation Templates
- **AWS ECR Registry** to store Docker container images
- **IAM Roles and policies** for CDK to execute deployments in your AWS account

To install the bootstrap stack run the following command:
```bash
cdk bootstrap
```

![](./img/cdk_bootstrap_stack.png)

> [!CAUTION]   
> Running `cdk bootstrap` command will use your **AWS CLI's default profile credentials**.     
> If you need to specify specific AWS region or AWS CLI profile for use, you have to define them in `/bin/cdk-workshop.ts` entry execution file  

Unfortunately, **CDK for now doesn't have a dedicated command to delete CDK boostrap stack, so you have to manually delete all the created resources in your AWS Console**. For S3 bucket make sure first to empty it and then try to delete it.

## Deploying CDK Default Sample App

After bootstrapping the CDK environment, we can now deploy our default CDK app with this single command:
```bash
cdk deploy
```

This will provisions SQS and SNS in our AWS account.

On your first run of the command you can see the alert message that shows what changes CDK is planning to do in your account and asks for your approval:
```bash
This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬────────────────────────────────┬────────┬─────────────────┬────────────────────────────────┬────────────────────────────────┐
│   │ Resource                       │ Effect │ Action          │ Principal                      │ Condition                      │
├───┼────────────────────────────────┼────────┼─────────────────┼────────────────────────────────┼────────────────────────────────┤
│ + │ ${CdkWorkshopQueue.Arn}        │ Allow  │ sqs:SendMessage │ Service:sns.amazonaws.com      │ "ArnEquals": {                 │
│   │                                │        │                 │                                │   "aws:SourceArn": "${CdkWorks │
│   │                                │        │                 │                                │ hopTopic}"                     │
│   │                                │        │                 │                                │ }                              │
└───┴────────────────────────────────┴────────┴─────────────────┴────────────────────────────────┴────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)?
```

You can inspect your deployed stack and resources in AWS CloudFormation Console:

![](./img/cfn_console_sns_sqs.png)

From `CdWorkshopStack` you can find our deployed resources:

![](./img/sqs_and_sns.png)

If you need to delete all stack and it's resources, then run:
```bash
cdk destroy
```