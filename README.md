<div align="center" padding=25px>
    <img src="images/confluent.png" width=50% height=50%>
</div>

# <div align="center">Application Modernization with Confluent Cloud</div>

## <div align="center">Workshop & Lab Guide</div>

# Introduction

In this demo, you'll walk through the stages describe in the [Strangler Fig Pattern](https://developer.confluent.io/patterns/compositional-patterns/strangler-fig) for incrementally breaking a monolithic application down into microservices. The intention of this demo is to express the stages involved in this process by providing components that come prebuilt and ready to deploy. All that's left is for you to deploy them in the order described in this guide and view the results.

---

## Prerequisites

In order to successfully complete this demo you need to install few tools before getting started.

- This demo was created using `minikube`. So that will be a necessity to have. On Mac, assuming you have `homebrew` (if not, get it), you can install it using the command `brew install minikube`.
- The development and testing for this demo was done on a `minikube` VM with approximately **4 CPUs**, **4GB of memory**, and **10GB of disk**. If that's more than your machine has, you can play around with less with the `minikube` commands. For example.
  ```sh
  minikube start --cpus=4 --disk-size="10gb" --memory="4gb"
  ```
- For some of the commands, you'll want a prettier output. So, `jq` is useful to have and will be use in these examples. If you don't have it installed, you can install it with `brew install jq`.
- This demo assumes you have Confluent Cloud setup and available to use. If you don't, sign up for a free trial [here](https://www.confluent.io/confluent-cloud/tryfree).
- Install Confluent Cloud CLI by following the instructions [here](https://docs.confluent.io/confluent-cli/current/install.html)
- Install Terraform by following the instructions [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).
- An AWS account with permissions to create resources. Sign up for an account [here](https://aws.amazon.com/account/).

> **Note:** This demo was built and validate on a Mac (x86).

---

## Step-by-Step

### Confluent Cloud Components

> **Note**: Ensure each step is completed successfully before proceeding to the next one.

1. Clone and enter this repo.

   ```bash
   git clone https://github.com/confluentinc/demo-application-modernization.git
   cd demo-application-modernization
   ```

1. Create a file to manage all the values you'll need through the setup.

   ```bash
   cat << EOF > env.sh
   # Confluent Creds
   export BOOTSTRAP_SERVERS="<replace>"
   export KAFKA_KEY="<replace>"
   export KAFKA_SECRET="<replace>"
   export SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='$KAFKA_KEY' password='$KAFKA_SECRET';"
   export SCHEMA_REGISTRY_URL="<replace>"
   export SCHEMA_REGISTRY_KEY="<replace>"
   export SCHEMA_REGISTRY_SECRET="<replace>"
   export SCHEMA_REGISTRY_BASIC_AUTH_USER_INFO="$SCHEMA_REGISTRY_KEY:$SCHEMA_REGISTRY_SECRET"
   export BASIC_AUTH_CREDENTIALS_SOURCE="USER_INFO"

   # AWS Creds for TF
   export AWS_ACCESS_KEY_ID="<replace>"
   export AWS_SECRET_ACCESS_KEY="<replace>"
   export AWS_DEFAULT_REGION="us-east-2" # You can change this, but make sure it's consistent

   EOF
   ```

   > **Note:** _Run `source env.sh` at any time to update these values in your terminal session. Do NOT commit this file to a GitHub repo._

1. Open a `Terminal` window and run the following commands to set up your Confluent Cloud infrastructure.

1. Log in to your cluster using the `confluent login` command using a Confluent Cloud user account.

   ```bash
   confluent login --save
   ```

1. Create a new Confluent Cloud environment.

   ```bash
   confluent environment create Application-Modernization
   ```

1. Switch to the Confluent Cloud environment you just created.

   ```bash
   confluent environment use <ID>
   ```

1. Create a new Kafka cluster. Basic cluster is enough for this demo.

   ```bash
   confluent kafka cluster create cluster1 --cloud "aws" --region "us-west-2" --type "basic"
   ```

1. Wait until the cluster is in `Running` state.
1. Enable `Schema Registery` by running the following command.

   ```bash
   confluent schema-registry cluster enable --cloud aws --geo 'us'
   ```

1. Create API key pair by running the following command.

   ```bash
   confluent api-key create --resource <KAFKA_CLUSTER_ID>
   ```

1. To verify the correct API key pair is in use, run the following command. The results should match the API key that you just created in previous step.

   ```bash
   confluent api-key list --resource <KAFKA_CLUSTER_ID>
   ```

1. Create a ksqlDB cluster by running the following command.

   ```bash
   confluent ksql cluster create ksqlDB_app1 --api-key <KAFKA_API_KEY> --api-secret <KAFKA_API_SECRET> --cluster <KAFKA_CLUSTER_ID>
   ```

1. Wait until the ksqlDB cluster's status is changed from `Provisioning` to `Running`.
1. Create an API key pair for the ksqlDB cluster.

   ```bash
   confluent api-key create --resource <KSQLDB_CLUSTER_ID>
   ```

1. Create the necessary Kafka topics.

   ```bash
   confluent kafka topic create postgres.bank.transactions
   confluent kafka topic create postgres.bank.accounts
   confluent kafka topic create postgres.bank.customers
   confluent kafka topic create express.bank.transactions
   ```
