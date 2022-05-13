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
                player_id: "{player_id}",
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
        name: "player name",
        age: "player age",
        years_in_pro: 1,
        height_in_inches: 72,
        weight_in_lbs: 172,
        shot_direction: "left or right",
        draft: "{draft_id}",
        drafted_at: 1,
        drafted_by: "team_name",
        career_earnings: 50000000,
        isInjured: true/false,
        condition: 100,
        stats: [{
            season: "season",
            team: "team name",
            games_played: 82,
            goals: 10,
            assists: 20,
            points: 30,
            plus_minus: 0,
            pims: 100,
            powerplay_goals: 3,
            short_handed_goals: 1,
            game_winning_goals: 12,
            game_tying_goals: 2,
            hits: 100,
            shots: 200,
            shooting_percentage: 5.0,
            average_time_on_ice: 23,
            IT: 67,
            SP: 80,
            ST: 60,
            EN: 92,
            DU: 92,
            DI: 69,
            SK: 86,
            PA: 86,
            PC: 83,
            DF: 77,
            SC: 78,
            EX: 90,
            LD: 91,
            OV: 83,
            Salary: 9250000
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