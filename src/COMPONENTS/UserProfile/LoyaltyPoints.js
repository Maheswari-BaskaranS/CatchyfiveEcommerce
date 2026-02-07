import React from 'react'

const LoyaltyPoints = () => {
    const [loyaltypointsarray, setloyaltypointsarray] = React.useState([])
    const getloyaltypoints = () => {
        let loyaltyarray = localStorage.getItem('loyaltypointsarray')
        loyaltyarray = JSON.parse(loyaltyarray)
        if(loyaltyarray){
            setloyaltypointsarray(loyaltyarray)
        }
    }
    React.useEffect(() => {
        getloyaltypoints()
    }, [])

    const getexpirydate = (date) => {
        let months = 2;
        let d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    }
    const getnormaldate = (date) => {
        let d = new Date(date);
        return d;
    }
    const getvalue = (points) => {
        let oneDollar = 100;
        let value = points / oneDollar;
        return value;  
    }
    return (
        <div className='yourorders'>
            <h1 className='mainhead2'>My Loyalty Points</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Points</th>
                        <th>Expiry</th>
                        <th>Value (100 points = S$1)</th>
                    </tr>
                </thead>
                <tbody>
                    {loyaltypointsarray && loyaltypointsarray.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{getnormaldate(item.Date).toDateString()}</td>
                                <td>{item.Points}</td>
                                <td>{getexpirydate(item.Date).toDateString()}</td>
                                <td>S$ {getvalue(item.Points)}</td>
                            </tr> 
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default LoyaltyPoints