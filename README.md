# iitu-cdk-workshop

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