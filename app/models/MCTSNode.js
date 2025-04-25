class MCTSNode {
    constructor (state)
    {
        this.state = state;
        this.parent = null;
        this.children = [];
        this.unexploredChildren = [];
        this.visits = 0 ;
        this.wins = 0;
        this.ucb = Infinity;
    }
    
    get getVisits () {
        return  this.visits;
    }


    getUCB1() {
        if (this.visits === 0) return Infinity;
        // Sử dụng phép chia để đảm bảo kết quả là float
        const exploitationTerm = this.wins / this.visits;
        const explorationTerm = Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
        return exploitationTerm + explorationTerm;
    }

    

    isFullyExpanded (){
        if (this.state.isTerminal()) return true;
        return this.children.length === this.state.getPossibleMoves().length;
    }

    //dieu kien: nếu chưa dc viếng lần nào thì chọn nút đó và dựa theo ucb 


}

export default MCTSNode;