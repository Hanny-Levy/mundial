import React from 'react';
import "./button.css";
import "./App.css";
import "./Selectors.css"
import "./input.css"
import {useEffect, useState} from "react";
import axios from "axios";
import './Table.css';

import Response from "./Response";

const SignInPage4 = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [selectedTeam1, setSelectedTeam1] = useState("");
    const [selectedTeam2, setSelectedTeam2] = useState("");
    const [signIn,setSignIn]=useState(false);
    const [live,setIsLive]=useState(false);
    const tableHeaders = ["Name" , "Goals For" , "Goals Against"];
    const [team1GoalsFor, setTeam1GoalsFor]=useState(0)
    const [team1GoalsAgainst , setTeam1GoalsAgainst]=useState(0)
    const [team2GoalsAgainst , setTeam2GoalsAgainst]=useState(0)
    const [team2GoalsFor , setTeam2GoalsFor]=useState(0)
    const [responseByCodeError,setResponseByCodeError]=useState(0);
    const [teamsInLive,setTeamsInLive]=useState([]);
    const [teams,setTeams]=useState([]);

    useEffect(()=>{
        axios.get("http://localhost:8989/get-teams-in-games").then((res) => {
            setTeamsInLive(res.data);
        })
    })

    useEffect(()=>{
        axios.get("http://localhost:8989/get-all-teams").then(res =>{
            setTeams(res.data)
            })
        },[])

    useEffect(()=>{
        if (live)
        axios.post("http://localhost:8989/update-live-game",null, {
            params: {
                team1 : selectedTeam1 ,
                team2 : selectedTeam2 ,
                team1GoalsFor : team1GoalsFor ,
                team2GoalsFor : team2GoalsFor
            }
        })
    },[team1GoalsFor,team2GoalsFor])

    const checkIfTeamIsPlaying=(team)=> {
        let playing = false;
        for (let i = 0; i < teamsInLive.length; i++) {
            if (team === teamsInLive[i].name) {
                playing = true;
                break;
            }
        }
        return playing;
    }

    const  onSignInClick = () =>{
        axios.post("http://localhost:8989/sign-in",null,{
            params:{
                username: username,
                password: password
            }
        }).then((res=>{
            if (res.data.errorCode==null){
                setSignIn(true);
            }else {
                setResponseByCodeError(res.data.errorCode);
            }
        }));
}

    const endGameButton=()=> {
        axios.post("http://localhost:8989/update-final-game",null, {
                params :{
                    team1:selectedTeam1,
                    team2: selectedTeam2,
                    team1GoalsFor: team1GoalsFor,
                    team2GoalsFor: team2GoalsFor,
                }
        }).then((res) =>{
            if ( res.data.success===true)
            alert("update successful")
            initGame();
        });
    }

    const clear = () =>{
        axios.post("http://localhost:8989/delete-live-game",null, {
            params :{
                team1:selectedTeam1,
                team2: selectedTeam2,
                team1GoalsFor: team1GoalsFor,
                team2GoalsFor: team2GoalsFor,
            }
        }).then((res) =>{
            if ( res.data.success===true)
                alert("delete successful")
        });
        initGame();
    }

    const initGame =()=>{
        setSelectedTeam1("");
        setSelectedTeam2("");
        setTeam2GoalsAgainst(0);
        setTeam1GoalsAgainst(0);
        setTeam1GoalsFor(0);
        setTeam2GoalsFor(0);
        setIsLive(false);
    }

    const setTeam1 = (event) => {
        setSelectedTeam1(event.target.value)
    }

    const setTeam2 = (event) => {
        setSelectedTeam2(event.target.value)
    }
    const onSaveButton = () =>{
     let live=" is already in live game";
        if (checkIfTeamIsPlaying(selectedTeam1)){
            alert(selectedTeam1 + live);
            if (checkIfTeamIsPlaying(selectedTeam2)){
                alert(selectedTeam2 + live);
            }
        }else {
            setIsLive(true);
            alert("Starting a live game ")
        }
    }
    const checkIfInputValid=(number)=>{
        let valid=true;
        if (number<0){
            valid=false;
            alert("invalid input");
        }

        return valid;
    }
    const setGoalsTeam1=(event)=>{
        if (checkIfInputValid(event.target.value)){
            setTeam1GoalsFor(event.target.value);
            setTeam2GoalsAgainst(event.target.value);
        }

    }
    const setGoalsTeam2=(event)=>{
        if (checkIfInputValid(event.target.value)){
            setTeam2GoalsFor(event.target.value);
            setTeam1GoalsAgainst(event.target.value);
        }


    }


        return (
        <div>
            <br/><br/><br/><br/>
            {
                !signIn ?
                    <center className={"positionTable"}>
                <table className={"table-wrapper"}>
                    <tr>
                        <th>
                            <input className={"inputStyle"} placeholder={"Enter your username"} value={username} onChange={(event) => {
                                setUsername(event.target.value)}}/>
                        </th>
                    </tr>

                      <tr>
                          <th>
                              <input className={"inputStyle"} placeholder={"Enter your password"} value={password} type={"password"} onChange={(event) => setPassword(event.target.value)}/>

                          </th>
                      </tr>

                      <tr>
                        <th>
                            <button onClick={onSignInClick} className={"button"} disabled={username.length===0||password.length===0}  >Sign In</button>
                        </th>
                    </tr>

                     <tr>
                         {(username.length!==0 && password.length!==0 && responseByCodeError!==0) &&
                         <Response errorCode={responseByCodeError}/>
                         }
                     </tr>

                </table>
                    </center>
                        :
                    <div>
                            <h1> Hello {username}</h1>
                            <h1 >Please choose 2 teams: </h1>
                       <br/><br/>

                    <table className={"selectTeamsTable"} >

                        <select className={"select"} id ="teams"  value={selectedTeam1} onChange={setTeam1}>
                            <option  disabled={true} value={""}  >
                                select your team
                            </option>
                            {
                                teams.map(team =>{
                                    let isDisable = team.name===selectedTeam2;
                                    return (
                                        <option   value={team.name} disabled={isDisable}>{team.name}</option>
                                    )
                                })
                            }
                        </select>
                        <select className={"select"} id ="teams" value={selectedTeam2} onChange={setTeam2} >
                            <option disabled={true} value={""}  >
                                select second team
                            </option>
                            {
                                teams.map(team =>{
                                    let isDisable = team.name===selectedTeam1 ;
                                    return (
                                        <option value={team.name} disabled={isDisable}>{team.name} </option>)
                                })
                            }
                        </select>

                        <button onClick={onSaveButton} disabled={live || selectedTeam1==="" || selectedTeam2===""} className={"button"}>save</button>

                        {
                            live &&
                            <div>
                            <table border={1} >
                            <tr>
                                {
                                    tableHeaders.map(header => {
                                        return (
                                            <th>
                                                {header}
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                                <tr>
                                    <td style={{height:"50px"}}>{selectedTeam1}</td>
                                    <td><input className={"goalsInput"} type={"number"} min={"0"} onChange={setGoalsTeam1} value={team1GoalsFor}/></td>
                                    <td>{team1GoalsAgainst}</td>


                                </tr>
                                <tr>
                                    <td>{selectedTeam2}</td>
                                    <td><input className={"goalsInput"} type={"number"}   min={"0"} onChange={setGoalsTeam2} value={team2GoalsFor}/></td>
                                    <td >{team2GoalsAgainst}</td>

                                </tr>

                           </table>
                                <button onClick={endGameButton} style={{margin:"10px"}} className={"button"}> End game </button>
                                <button onClick={clear} style={{margin:"25px"}} className={"button"}> Delete</button>

                            </div>

                        }
                    </table>
                    </div>
            }

        </div>
    );
};

export default SignInPage4 ;
