import React, { useEffect, useState } from "react";

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.css';
import { Button } from "react-bootstrap";

const Dashboard = () => {
    
    const [grid, setGrid] = useState()
    useEffect(() => {
        setGrid(GridStack.init());
    },[]);
    
    const addNewWidget = () => {
       grid.load([
            { x: 2, y: 1, h: 2, content:"1" },
            { x: 2, y: 4, w: 3, content:"2" },
            { x: 4, y: 2, h:5, content: "3" },
            { x: 3, y: 1, h: 2, content:"4" },
            { x: 0, y: 6, w: 2, h: 2, content:"5" },
          ])

    }

    return (
        <div className="App">
            <Button onClick={()=>{addNewWidget()}}>Add widget</Button>
            <div className="grid-stack">
               
            </div>
        </div>
    );
}

export default Dashboard;