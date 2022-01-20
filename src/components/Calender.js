import React, {Component,useState,useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '../calender.css'
import axios from 'axios'

import styled from "@emotion/styled"
export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
    background: #433;
    background-image: none;
}`

function Calender ({events}) {

    return (  
        <div className='calender'>
            <StyleWrapper>
            <FullCalendar 
            defaultView="dayGridMonth" 
            plugins={[ dayGridPlugin ]}
            //eventClick={clickDate}
            events={events}
            eventColor='#efb33f'></FullCalendar>
            </StyleWrapper>
        </div>
    )

}
export default Calender;