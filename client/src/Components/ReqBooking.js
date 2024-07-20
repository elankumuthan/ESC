import React from "react";
import "../Styles/ReqBox.css"
import { ChakraProvider } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter,Stack, StackDivider, Heading, Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'


function GuestInfo() {
    return (
        // <ChakraProvider>
        //     <Heading>Confirm & Pay</Heading>
        //     <Card>
        //     <CardHeader>
        //         <Heading size='md'>Your Trip</Heading>
        //     </CardHeader>

        //     <CardBody>
        //         <Stack spacing='4'>
        //         <Box>
        //             <Heading size='xs' textTransform='uppercase'>
        //             Date 
        //             </Heading>
        //             <Text pt='2' fontSize='sm'>
        //             View a summary of all your clients over the last month.
        //             </Text>
        //         </Box>
        //         <Box>
        //             <Heading size='xs' textTransform='uppercase'>
        //             Guests
        //             </Heading>
        //             <Text pt='2' fontSize='sm'>
        //             Check out the overview of your clients.
        //             </Text>
        //         </Box>
        //         </Stack>
        //     </CardBody>
        //     </Card>
        // </ChakraProvider>
        <div>
            <form>
                <h2>Guest Information</h2>
                <label>First Name</label>
                <input type="text" required />
                <label>Last Name</label>
                <input type="text" required />
                <br/>
                <label>Phone No</label>
                <input type="text" required />
                <label>Email Addr</label>
                <input type="email" required />
                <br/>
                <label>Special Req</label>
                <input type="text" required />
            </form>
        </div>
    );
    // return (
    //     <div>
    //         <div className="reqbox">
    //             <p className="reqBookTitle">Request to Book</p>
    //             <p>Your Trip</p>
    //         </div>

    //         <div class="container">
    //             <div className="tripHeader">Dates</div>
    //             <div className="tripHeader">Guests</div>
    //         </div>
    //     </div>
    // );
}



export default GuestInfo;