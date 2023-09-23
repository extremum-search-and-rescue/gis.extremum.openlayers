import secrets from "./secrets";
if(!window.ENV)
{
    console.info("ENV variable should be defined in real application before this script")
    window.ENV = {

    };
}

const config = {
    ...ENV,
    ...secrets
}
export default config;