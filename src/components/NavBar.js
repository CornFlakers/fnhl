import { LeagueNavBar } from './LeagueNavBar';
import { MainNavBar } from './MainNavBar';
import { MobileNavBar } from './MobileNavBar';

export const NavBar = () => {
    return(
        <div>
            <div>
            <LeagueNavBar />
            </div>
            <div>
            <MainNavBar />
            </div>
            {/* <div className="">
                <MobileNavBar />
            </div> */}
        </div>
    )
}