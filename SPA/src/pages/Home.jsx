import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    //get access token from activeAccount
    const request = {
        scopes: [process.env.REACT_APP_TODO_API_READ_SCOPE]
    }
    instance.acquireTokenSilent(request)
    .then((response) => {
      console.log(response.accessToken);
    })
    .catch((error) => {
      console.log(error);
    });
    return (
        <>
            <AuthenticatedTemplate>
                {
                    activeAccount ?
                        <Container>
                            <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                        </Container>
                        :
                        null
                }
            </AuthenticatedTemplate>
        </>
    );
}
