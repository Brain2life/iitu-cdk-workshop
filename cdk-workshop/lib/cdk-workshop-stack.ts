// Import the core building blocks from the AWS CDK library
import { Stack, StackProps } from "aws-cdk-lib"; 
// Import specific classes needed to define a Lambda function
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
// Import the base 'Construct' class (all CDK components are Constructs)
import { Construct } from "constructs";

// Define a new class that represents our CloudFormation Stack
export class CdkWorkshopStack extends Stack {
  
  // The constructor is where we define our resources
  // 'scope' is the parent (usually the App), 'id' is a unique name for this stack
  constructor(scope: Construct, id: string, props?: StackProps) {
    // Call the parent 'Stack' constructor to initialize the stack
    super(scope, id, props);

    /**
     * Define an AWS Lambda Resource (an L2 Construct)
     * 'this' refers to this stack (the scope)
     * 'HelloHandler' is the logical ID inside CloudFormation
     */
    const hello = new Function(this, "HelloHandler", {
      
      // 1. Specifies the engine: Node.js version 22
      runtime: Runtime.NODEJS_22_X, 
      
      // 2. Tells CDK where the actual code sits on your computer. 
      // It will zip up everything inside the "lambda" folder and upload it.
      code: Code.fromAsset("lambda"), 
      
      // 3. The 'entry point' in your code. 
      // "hello.handler" means: Look in 'hello.js' for a function named 'handler'.
      handler: "hello.handler", 
    });
  }
}