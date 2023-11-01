export const cookAdInfoData = (adInfos: Array<any>) => {
    const newAdInfos = adInfos.map(ad => ({
        name: ad.name,
        total: ad.total,
        id: ad.account_id,
        status: ad.status,
        surplus: ad.balance,
        limit: ad.adtrust_dsl,
        currency: ad.currency,
        threshold_amount: ad.threshold_amount,
    }))

    return newAdInfos
}