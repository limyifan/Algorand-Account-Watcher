const {expect} = require('chai');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require('../common/config/env.config');
const appEndPoint = config.appEndpoint
describe('addNewWatchAccount', () => {
    const getWatchListEndPoint = `${appEndPoint}/getWatchList`

    it('should return all watched account', async () => {
        const res = await fetch(getWatchListEndPoint)
        const watchList = await res.json()

        // Expect the return result not to be null
        expect(watchList).to.be.exist;
    });

    it('should return fail on duplicated address', async () => {
        const newAccount = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA"
        const api = `${appEndPoint}/addWatch/${newAccount}`
        await fetch(api, {method: 'POST'})

        //call again with the same address
        let res = await fetch(api, {method: 'POST'})
        const errorCode = res.status
        expect(errorCode).to.be.eq(400)

    });
    it('should return fail on invalid address', async () => {
        const invalidAccount = "abcde"
        const api = `${appEndPoint}/addWatch/${invalidAccount}`

        let res = await fetch(api, {method: 'POST'})
        const errorCode = res.status
        expect(errorCode).to.be.eq(400)

    });

    it('should add new account to watch list', async () => {
        const newAccount = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA"
        const api = `${appEndPoint}/addWatch/${newAccount}`
        await fetch(api, {method: 'POST'})

        const res = await fetch(getWatchListEndPoint)
        const watchList = await res.json()
        const addresses = watchList.map(item => item.address)

        // Expect the address exists in the watch list
        expect(addresses.indexOf(newAccount)).to.be.greaterThanOrEqual(0);
    });

});