let db = {
    users : [{
        doc_id: guid,
        commissioner_for_league: "/leagues/{league_id}",
        email: "name@mail.com",
        isGM: true/false,
        isLeagueOfficial: true/false,
        name: "name",
        default_league: "{league_id}"
    }],

    leagues : [{
        doc_id: guid,
        commissioner: "/users/{user_id}",
        current_season: "season",
        name: "league name",
        salary_cap: 72000000,
        teams: [{
            doc_id: guid,
            season_joined: "season",
            code: "3 letter team name",
            gm: [{
                label: "gm name",
                value: "{user_id}"
            }],
            hasGM: true/false,
            name: "team name",
            contracts: [{
                doc_id: guid,
                season: "season",
                player_id: "leagues/players/{player_id}",
                jersey_number: 99,
                position: "F or D or G",
                salary: 9250000,
                level: "Professional, Professional Minor, Junior"
            }],
            active_roster:[{
                lw1: "left wing 1",
                c1: "center 1",
                rw1: "right wing 1",
                d1: "defenceman 1",
                d2: "defenceman 2",
                lw2: "left wing 2",
                c2: "center 2",
                rw2: "right wing 2",
                d3: "defenceman 3",
                d4: "defenceman 4",
                lw3: "left wing 3",
                c3: "center 3",
                rw3: "right wing 3",
                d5: "defenceman 5",
                d6: "defenceman 6",
                g1: "goalie 1",
                g2: "goalie 2",
                skater1: "f or d",
                skater2: "f or d",
                skater3: "f or d"
            }]
        }]
    }],

    players: [{
        doc_id: guid,
        age: 00,//user provided, default 18
        career_earnings: 50000000, //default 0
        condition: 100, //default 100
        current_team: "{team_id}",//user provided, default anaheim id
        current_team_value: "{team name}",//user provided, default anaheim name
        draft: "{draft_id}",//default 0
        drafted_at: 1,//default 0
        drafted_by: "{team_name}",//defualt current_team_value
        drafted_detail: "1/26, First Round, 26th Overall",//default ""
        height_in_inches: 000,//user provided, default 72/6ft
        isInjured: true/false,//default false
        name: "player name",//user provided
        shot_direction: "left or right",//user provided
        weight_in_lbs: 000,//user provided, default 200lbs
        years_in_pro: 00,//default 0
        stats: [{
            season: "season",//default to current, leagueInfo.id
            team: "team name",//
            team_id:"team id",//
            games_played: 82,//default 0
            goals: 10,//default 0
            assists: 20,//default 0
            points: 30,//default 0
            plus_minus: 0,//default 0
            pims: 100,//default 0
            powerplay_goals: 3,//default 0
            short_handed_goals: 1,//default 0
            game_winning_goals: 12,//default 0
            game_tying_goals: 2,//default 0
            hits: 100,//default 0
            shots: 200,//default 0
            shooting_percentage: 5.0,//default 0
            average_time_on_ice: 23,//default 0
            IT: 67,//user provided, default 50
            SP: 80,//user provided, default 50
            ST: 60,//user provided, default 50
            EN: 92,//user provided, default 50
            DU: 92,//user provided, default 50
            DI: 69,//user provided, default 50
            SK: 86,//user provided, default 50
            PA: 86,//user provided, default 50
            PC: 83,//user provided, default 50
            DF: 77,//user provided, default 50
            SC: 78,//user provided, default 50
            EX: 90,//user provided, default 50
            LD: 91,//user provided, default 50
            OV: 83,
            Salary: 9250000//user provided, default 750,000
        }]
    }],

    games:[{
        doc_id: guid,
        league: "league_id",
        season: "season",
        home_team: "wpg",
        away_team: "phi",
        attendance: 10000,
        three_stars: [{
            first_star: "player",
            second_star: "player",
            third_star: "player",
        }],
        home_goal_total: 3,
        away_goal_total: 4,
        goals:[{
            team: "home or away",
            period: "1 or 2 or 3",
            goal_total: 1
        }],
        powerplays:[{
            team: "home or away",
            powerplay_result: "scored_on for total"
        }],
        shots:[{
            team: "home or away",
            period: "1 or 2 or 3",
            shot_total: 10,
        }],
        game_events:[{
            period: "1 or 2 or 3 or OT1 .. OTN",
            time: "0:00 - 20:00",
            event_type: "faceoff, pass, receive posession, intercept, giveaway, takeaway, hit, penalty, shot, score, save, block, dump, zone entry, injury",
            event_from: "player",
            event_to: "player",
        }],
        roster:[{
            team: "home or away",
            lw1: "left wing 1",
            c1: "center 1",
            rw1: "right wing 1",
            d1: "defenceman 1",
            d2: "defenceman 2",
            lw2: "left wing 2",
            c2: "center 2",
            rw2: "right wing 2",
            d3: "defenceman 3",
            d4: "defenceman 4",
            lw3: "left wing 3",
            c3: "center 3",
            rw3: "right wing 3",
            d5: "defenceman 5",
            d6: "defenceman 6",
            g1: "goalie 1",
            g2: "goalie 2",
            skater1: "f or d",
            skater2: "f or d",
            skater3: "f or d"
        }],
        game_stats:[{
            player: "player",
            goals: 0,
            assists: 0,
            points: 0,
            plus_minus: -1,
            pims: 2,
            shots: 5,
            hits: 2,
            toi: 15
        }],
        goalie_stats:[{
            player: "player",
            result: "W or L",
            shots_against: 25,
            saves: 21,
            save_percentage:0.840,
            shutout: 0
        }],
        game_notes:[{
            home_profit:1500000,
            injuries:[{
                player: "player",
                injury_type: "minor, serious",
                suspension: "yes, no"
            }]
        }]


    }]

}