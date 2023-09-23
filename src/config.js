import secrets from "./secrets";

if(!ENV)
{
    console.info("ENV variable should be defined in real application before this script")
    ENV = {

    };
}

const config = {
    ...ENV,
    ...secrets
}
export default config;