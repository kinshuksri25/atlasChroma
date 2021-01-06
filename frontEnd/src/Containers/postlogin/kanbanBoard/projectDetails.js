//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import ReactApexCharts from 'react-apexcharts'

import "../../../StyleSheets/projectDetails.css"
import DateHelper from '../../generalContainers/date';

class ProjectDetails extends Component{

    constructor(props){
        super(props);
        this.state={
            totalStoriesCount : this.props.projectDetails.storydetails.length,
            finishedStoriesCount : 0,
            inProgressStoriesCount : 0,
            onHoldStoriesCount : 0,
            overDueStoriesCount : 0,
            status : ""
        }
        this.onClickStory = this.onClickStory.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.buildProgressRadialBar = this.buildProgressRadialBar.bind(this);
        this.buildStoriesRadialBar = this.buildStoriesRadialBar.bind(this);
        this.topOverDueStories = this.topOverDueStories.bind(this);
        this.topHighPriorityStories = this.topHighPriorityStories.bind(this);
    }

    componentDidMount(){
        let finishedStoriesCount = 0;
        let inProgressStoriesCount = 0;
        let onHoldStoriesCount = 0;
        let overDueStoriesCount = 0;

        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;

        this.props.projectDetails.storydetails.map(story => {
            story.priority == "OnHold" && story.status != "Finished" && onHoldStoriesCount++;
            story.priority != "OnHold" && story.status == "Ongoing" && inProgressStoriesCount++;
            story.priority != "OnHold" && story.status == "Ongoing"  && story.duedate < currentDate && overDueStoriesCount++;
            story.status == "Finished" && finishedStoriesCount++;
        });


        this.setState({finishedStoriesCount : finishedStoriesCount,
                        inProgressStoriesCount : inProgressStoriesCount,
                        onHoldStoriesCount : onHoldStoriesCount,
                        overDueStoriesCount : overDueStoriesCount,
                        status : this.props.projectDetails.status == "Finished" ? "Finished" : this.props.projectDetails.duedate < currentDate ? "OverDue" : "InProgress"});
    }

    sortStories(stories){
        let priorityList = {
            "Urgent" : 5,
            "High" : 4,
            "Medium" : 3,
            "Low"  : 2,
            "OnHold" : 1
        };
        let sel={},tempVal={},counter=0,selIndex=0;
        let arrLen = stories.length;
        for(let i = 0; i < arrLen; i++){
            counter = i;
            sel = stories[i];
            while(counter < arrLen){
                if(priorityList[stories[counter]["priority"]] >= priorityList[sel["priority"]])
                {
                  if(priorityList[stories[counter]["priority"]] == priorityList[sel["priority"]]){
                    if(stories[counter]["duedate"] <= sel["duedate"]){
                        sel = stories[counter];
                        selIndex = counter;
                    }
                  }else{
                    sel = stories[counter];
                    selIndex = counter;
                  }
                } 
                counter++;
            }
            tempVal = stories[i];
            stories[i] = sel;
            stories[selIndex] = tempVal;
        }
        return stories;
    }

    onClickStory(event){
        let url = "/projects/"+this.props.projectDetails._id+"?storyID="+event.target.id; 
        window.history.replaceState({}, "",url);
        location.reload();
    }

    buildStoriesRadialBar(){
        let globalThis = this;
        let series= [((this.state.inProgressStoriesCount/this.state.totalStoriesCount)*100), 
                    ((this.state.onHoldStoriesCount/this.state.totalStoriesCount)*100), 
                    ((this.state.overDueStoriesCount/this.state.totalStoriesCount)*100), 
                    ((this.state.finishedStoriesCount/this.state.totalStoriesCount)*100)];
        let options= {
            chart: {
                width: 400,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '50%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                            formatter: function (val) {
                                return Math.ceil((val*globalThis.state.totalStoriesCount)/100);
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total Stories',
                            formatter: function (w) {
                                return globalThis.state.totalStoriesCount;
                            }
                        }
                    },
                }
            },
            colors: ['#1F8ED8', '#EBDC0E', '#CD4848', '#42C444'],
            labels: ['InProgress Stories', 'OnHold Stories', 'OverDue Stories', 'Finished Stories'],
            stroke: {
                lineCap: "round",
            },
            legend: {
                show: true,
                floating: true,
                fontSize: '12px',
                position: 'left',
                labels: {
                  useSeriesColors: true,
                },
                markers: {
                  size: 0
                },
                formatter: function(seriesName, opts) {
                  return seriesName + ":  " + Math.ceil((opts.w.globals.series[opts.seriesIndex]*globalThis.state.totalStoriesCount)/100)
                },
                itemMargin: {
                  vertical: 3
                }
            }
        }
        return <ReactApexCharts options={options} series={series} type="radialBar" width={400}/>;
    }

    buildProgressRadialBar(){
        let color = "";
        switch(this.props.projectDetails.status){
            case "Finished" :
                color =  '#42C444';
                break;
            case "OverDue" :
                color =  '#CD4848';
                break;
            default :
                color =  '#1F8ED8';
                break;
        }
        let series= [(((this.state.finishedStoriesCount)/this.state.totalStoriesCount)*100)];
        let options= {
            chart: {
                width: 400,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: 0,
                    hollow: {
                        size: '70%',
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                            formatter: function (val) {
                                return Math.floor(val)+"%";
                            }
                        }
                        
                    },
                }
            },
            colors: [color],
            labels: ['Progress'],
            stroke: {
                lineCap: "round",
            }
        }
        return <ReactApexCharts options={options} series={series} type="radialBar" width={400}/>;
    }

    topOverDueStories(){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let overDueStories = [];
        this.props.projectDetails.storydetails.map(story => {
            story.duedate < currentDate && story.status != "Finished" && overDueStories.push(story);
        });
        if(overDueStories.length > 0){
            overDueStories = this.sortStories(overDueStories);
            overDueStories = overDueStories.length <= 5 ? overDueStories : overDueStories.slice(0,5);

            return(<div>
                        <h6><strong>Top OverDue Stories</strong></h6>
                        <div className="projectDetailsBody">
                            {
                                overDueStories.map(story =>{
                                    let photo = "";
                                    this.props.userList.map(user => {
                                        photo = user.username == story.contributor ? user.photo : photo;
                                    });
                                    return (<p id={story._id} onClick={this.onClickStory}>{story.storytitle} <img className = "profilePicture" src={photo} onClick={this.dummyHandler} onClick={this.dummyHandler}/></p>)
                                })
                            }
                        </div>
                    </div>)
        }else{
           return(<div>
                    <h6><strong>Top OverDue Stories</strong></h6>
                    <div className="projectDetailsEmptyBody">
                        <p>Looks Like you have no overdue stories</p>
                    </div>
                  </div>)
        }
    }

    topHighPriorityStories(){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;

        let highPriorityStories = [];
        this.props.projectDetails.storydetails.map(story => {
            story.duedate >= currentDate && story.status != "Finished" && highPriorityStories.push(story);
        });
        if(highPriorityStories.length > 0){
            highPriorityStories = this.sortStories(highPriorityStories);
            highPriorityStories = highPriorityStories.length <= 5 ? highPriorityStories : highPriorityStories.slice(0,5);
            return(<div>
                        <h6><strong>High Priority Stories</strong></h6>
                        <div className="projectDetailsBody">
                            {
                                highPriorityStories.map(story =>{
                                    let photo = "";
                                    this.props.userList.map(user => {
                                        photo = user.username == story.contributor ? user.photo : photo;
                                    });
                                    return (<p id={story._id} onClick={this.onClickStory}>{story.storytitle} <img className = "profilePicture" src={photo} onClick={this.dummyHandler} onClick={this.dummyHandler}/></p>)
                                })
                            }
                        </div>
                    </div>)
        }else{
           return(<div>
                    <h6><strong>High Priority Stories</strong></h6>
                    <div className="projectDetailsEmptyBody">
                        <p>Looks Like you have no stories in this project</p>
                    </div>
                  </div>)
        }
    }

    render(){

        return(<div>
                    <div className = "radialGraphContainer">
                        {this.buildStoriesRadialBar()}
                        {this.buildProgressRadialBar()}
                    </div>
                    <div className = "secDetailContainer">   
                        {this.topOverDueStories()}
                        {this.topHighPriorityStories()}
                    </div>
                </div>);
    }

}

const mapStateToProps = state => {
    return {
        userList : state.userListStateReducer
    }
}

export default connect(mapStateToProps,null)(ProjectDetails); 