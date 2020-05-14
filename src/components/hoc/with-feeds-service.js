import React from 'react';

import { FeedsConsumer } from '../feeds-service-context';

const withFeedsService = () => (Wrapped) => (props) => {
    
    return (
        <FeedsConsumer>
            {
                ( feedsService ) => {
                    return <Wrapped {...props} feedsService={feedsService} />;
                }
            }
        </FeedsConsumer>
    );
}

export default withFeedsService;