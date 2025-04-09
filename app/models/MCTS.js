import MCTSNode from "./MCTSNode";
import gameState from './GameState';

class MCTS {
    constructor (rootState){
        this.root = new MCTSNode(rootState);
        this.temp =[];
        console.log("MCTS initialized. Root node:", this.root);
    }

    run (iterations){
        this.addChild(this.root);
        this.temp = this.root.children;
        console.log("Children of root node temp:", this.temp);
        for ( let i = 0 ; i< iterations; i++){
            let node = this.selection();
            console.log("🔍 Selected Node:", node);
            let newNode = this.expansion(node);
            console.log("🌱 Expanded Node:", newNode); 
            let result = this.simulation(newNode);
            console.log("🎲 Simulation Result:", result);
            console.log("Backpropagation started for node:", newNode);
            console.log("root hien tai ", this.root);
            this.backPropagation(newNode, result);
            console.log("Running iteration:", i);
        }
    }

    addChild(node) {
        const game = new gameState(node.state.board);
        const unexploredMoves = game.getPossibleMoves();
        unexploredMoves.forEach(move => {
            node.children.push(move); // Thêm nút con vào children
        });
    }

    selectBestChild (node) {
        if (node.children.length === 0 ) return null;
        let bestChild = node.children[0]; // giả sử nút đầu tiên là tốt nhất
        let bestUCB = node.getUCB1();//5 
        console.log("Best child:", bestChild);
        console.log("Best UCB:", bestUCB);
        for (let i = 0; i < node.children.length; i++ ) {
            // if (node.children[i].getVisits() === 0) return node.children[i]; // Nếu chưa được viếng lần nào thì chọn luôn
            let child = new MCTSNode(node.children[i]); // lấy con nút thứ i 
            
            const childUcb = child.getUCB1(); // tính gtri ucb nút con thứ i

            if (childUcb  > bestUCB )
            {
                bestChild = child;
                bestUCB = childUcb;
            }
            else {
                continue;
            }
        }
        return bestChild;
    }
    //selection
    selection () {
        // chọn node có nước đi dễ thắng nhất cho tới khi nút không còn được mở rộng và là nút lá 
        let node = this.root;
        console.log("Node  dong 60:", node);
        let bestChild = null;
        while ( node.children.length > 0 ){
            bestChild = this.selectBestChild(node)// chọn nút con tốt nhất
            console.log("da chay vao lenh while dong 65", bestChild);
            return bestChild;
        }
        console.log("best child dong 67:", bestChild);

        return node; // nó là nút lá 
    }


    expansion(node) {
        // if (node!== null ) return node;
        console.log("selection node duoc truyen vao dong 75", node);
        
        // const randomIndex = Math.floor(Math.random() * this.root.children.length);
        // console.log(" Random index for unexplored moves:", randomIndex);
        // const move = this.root.children[randomIndex];
        // console.log(" move expansion ", move);
        const newGameState = new gameState(this.root.state.board,0,1,this.root.state.lastMove);
        console.log(" moves expansion ", newGameState);
        const nextState = newGameState.applyMove(node);
        console.log(" next state", nextState);
        this.root.children.splice(node, 1);
        console.log(" children after expansion", this.root.children);
        return nextState;

    }
// đang làm hàm này
    simulation (node) {
        let i = 0;
        let state = node;
        let isPlayerTurn = state.getPlayerTurn;
        console.log("State before simulation:", state);
        while (!state.isTerminal() && i< 10) {
            const moves = state.getPossibleMoves();
            console.log(" state simulation ", moves);
            console.log("isPlayerTurn:", isPlayerTurn);
            if (isPlayerTurn === 0){ //ngau nhien luot choi cua nguoi choi 
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                console.log("Random move cua nguoi choi:", randomMove);
                state.setPlayerTurn = 1;
                state.setNextPlayer = 0;
                state = state.applyMove(randomMove);
                isPlayerTurn = state.getPlayerTurn;
                console.log("State after random move cua nextplayer:", state);
            }
            else {
                console.log("Nuoc di con trong:", moves);
                const node = new MCTSNode();
                node.children = moves;
                console.log("Node children 114:", node.children);
                const newMoves = this.selectBestChild(node);
                state.setPlayerTurn = 0;
                state.setNextPlayer = 1;
                state = state.applyMove(newMoves);
                isPlayerTurn = state.getPlayerTurn;
            }
            i++;
        }
        return state.getResult();
    }

    backPropagation (node,result) {
        let i = 0;
        console.log("node moi vao cua backpropagation", node);
        let newNode = new MCTSNode();
        newNode.state = node;
        newNode.parent = this.root.state._lastMove;
        console.log("newNode backpropagation", newNode);
        while (newNode) {
            newNode.visits++;
            newNode.wins += result;
            newNode = newNode.parent;
            console.log("Backpropagation complete. node:", newNode," lan:", i);
            console.log("Backpropagation complete. result:", result," lan:", i);
            i++;
        }
        console.log("hoan thanh back", newNode);
    }
}

export default MCTS;