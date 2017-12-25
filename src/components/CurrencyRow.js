import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { sellBuyFetch } from '../actions';

class CurrencyRow extends Component {
    state = {
        fetching: false,
        isError: false
    };


    fetchDoge = () => {
        this.setState({fetching: true});
        fetch(`https://btc-trade.com.ua/api/trades/buy/${this.props.code}`)
            .then(response => response.json())
            .then(buyResult => {
                fetch(`https://btc-trade.com.ua/api/trades/sell/${this.props.code}`)
                    .then(response1 => response1.json())
                    .then(sellResult => {
                        this.setState({
                            fetching: false,
                            isError: false,
                            buyResult,
                            sellResult,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.setState({
                            isError: true,
                        })
                    });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    isError: true,
                })
            });

    };

    componentWillMount() {
        // this.fetchDoge();
        this.props.sellBuyFetch(this.props.code);
    }

    refresh = () => {
        this.props.sellBuyFetch(this.props.code);
    };

    renderResults() {
        const { currencies, code } = this.props;
        const currency = currencies[code];
        if (currency.fetching) {
            return <ActivityIndicator size='large' />;
        }

        if (currency.isError) {
            return <Text>Error. Please try again later.</Text>
        }

        if (!currency.buyResult || !currency.sellResult) {
            return <View />;
        }

        return (
            <View>
                <Text style={styles.rateStyle}>Buy: {currency.buyResult.max_price}</Text>
                <Text style={styles.rateStyle}>Sell: {currency.sellResult.min_price}</Text>
            </View>
        )
    }

    renderRefreshButton() {
        if (!this.state.fetching) {
            return (
                <Button
                    icon={{ name: 'refresh', color: '#4496EC' }}
                    backgroundColor='rgba(0, 0, 0, 0)'
                    onPress={this.refresh}
                />
            );
        }
    }

    render() {
        // console.log('render');
        // console.log(this.state);
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.titleStyle}>{this.props.title}</Text>
                <View style={styles.rateContainerStyle}>
                    {this.renderResults()}
                </View>
                {this.renderRefreshButton()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        marginBottom: 20,
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    titleStyle: {
        marginBottom: 10,
        fontWeight: 'bold',
        width: '30%',
        textAlign: 'center',
        justifyContent:'center'
    },
    rateStyle: {
        textAlign: 'left',
    },
    rateContainerStyle: {
        width: '50%',
    }
};

const mapStateToProps = ({currencies}) => {
    return { currencies };
};

export default connect(mapStateToProps, { sellBuyFetch })(CurrencyRow);