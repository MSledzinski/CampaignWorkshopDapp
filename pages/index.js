import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layouts';
import factory from '../ethereum/factory';
import { Link } from '../routes';

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaign().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(item => {
            return {
                header: item,
                description: (
                    <Link route={`/campaigns/${item}`}>
                        <a>View details</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Available Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button 
                                floated="right"
                                content="Create new"
                                icon="add circle"
                                primary
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
        </Layout> );
    }
}

export default CampaignIndex;