class MCTSNode {
    constructor (state)
    {
        this.state = state;
        this.parent = null;
        this.children = [];
        this.unexploredChildren = [];
        this.visits = 0 ;
        this.wins = 0;
    }
    
    get getVisits () {
        return  this.visits;
    }


    getUCB1 () {
        if (this.visits === 0) return Infinity;
        return this.wins / this.visits + Math.sqrt(2 * Math.log(this.parent.visits) /this.visits);
    }

    isFullyExpanded (){
        if (this.state.isTerminal()) return true;
        return this.children.length === this.state.getPossibleMoves().length;
    }

    //dieu kien: nếu chưa dc viếng lần nào thì chọn nút đó và dựa theo ucb 


}

export default MCTSNode;