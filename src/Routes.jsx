import { useContext } from 'react'
import RegisterAndLogin from './RegisterAndLogin'
import { UserContext } from './UserContext'
import Chart from './Chat';


export default function Routes() {
    const { userName, id } = useContext(UserContext);
    if (userName) {
        return <Chart/>
    }
    return (
        <>
            <RegisterAndLogin />
        </>
    )
}