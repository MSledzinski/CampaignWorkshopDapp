import React, { Component } from 'react';
import Layout from '../../components/Layouts'
import CampaignFetch from '../../ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3'
import ContributeForm from '../../components/ContributeForm'

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;

        const campaignContract = CampaignFetch(campaignAddress);

        const summary = await campaignContract.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: campaignAddress
        };
    }

    renderCards() {
        const { balance, manager, minimumContribution, requestsCount, approversCount } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Manager address',
                description: 'Creator of this campaign, can withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (in wei) ',
                description: 'Minimum amount you need to controbute to particiapte',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                meta: 'Pending requests',
                description: 'Number of pending withdraw requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                meta: 'Approvers',
                description: 'Number of contributors for campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Balance',
                description: 'Current campaign balance',
                style: { overflowWrap: 'break-word' }
            }
        ];

        return <Card.Group items={items} />
    }
    render() {
        return (
            <Layout>
                <h2>Details</h2>
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={this.props.address} />
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;