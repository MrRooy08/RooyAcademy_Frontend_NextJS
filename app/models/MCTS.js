import MCTSNode from "./MCTSNode";
import gameState from './GameState';

class MCTS {
    constructor (rootState){
        this.root = new MCTSNode(rootState);
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
            console.log("root sau khi ket thuc ", this.root.children[0]);
            console.log(this.root.children[0] instanceof MCTSNode); // 👉 true hoặc false
            console.log("Running iteration:", i);
        }
    }

    addChild(node) {
        const game = new gameState(node.state.board);
        const unexploredMoves = game.getPossibleMoves();
        unexploredMoves.forEach(move => {
            const child = new MCTSNode(move); // Tạo nút con từ nước đi
            child.parent = node; // Thiết lập parent cho nút con
            node.children.push(child); // Thêm nút con vào children
            node.unexploredChildren.push(move); // Thêm nút con vào unexploredMoves
        });
    }

    selectBestChild (node) {
        if (node.unexploredChildren.length === 0 ) return null;
        let bestChild = node.unexploredChildren[0]; // giả sử nút đầu tiên là tốt nhất
        let bestUCB = node.getUCB1();//5 
        console.log("Best child:", bestChild);
        console.log("Best UCB:", bestUCB);
        for (let i = 0; i < node.unexploredChildren.length; i++ ) {
            // if (node.children[i].getVisits() === 0) return node.children[i]; // Nếu chưa được viếng lần nào thì chọn luôn
            let child = new MCTSNode(node.unexploredChildren[i]); // lấy con nút thứ i 
            
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
        while ( node.unexploredChildren.length > 0 ){
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
        
        const newGameState = new gameState(this.root.state.board,0,1,this.root.state.lastMove);
        console.log(" moves expansion ", newGameState);
        const nextState = newGameState.applyMove(node);
        console.log(" next state", nextState);
        const childNode = this.root.children.find(child => child.state === nextState._lastMove); // tìm nút con trong children của root
        childNode.state = nextState; // cập nhật state cho nút con
        console.log("child node expansion", childNode);
        this.root.unexploredChildren.splice(node, 1);
        console.log(" children after expansion", this.root.children);
        return childNode;

    }
// đang làm hàm này
    simulation (node) {
        let i = 0;
        let nodeExpand = {...node};
        let isPlayerTurn = nodeExpand.state.getPlayerTurn;
        console.log("State before simulation:", nodeExpand);
        while (!nodeExpand.state.isTerminal() && i< 10) {
            const moves = nodeExpand.state.getPossibleMoves();
            console.log(" state simulation ", moves);
            console.log("isPlayerTurn:", isPlayerTurn);
            if (isPlayerTurn === 0){ //ngau nhien luot choi cua nguoi choi 
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                console.log("Random move cua nguoi choi:", randomMove);
                nodeExpand.state.setPlayerTurn = 1;
                nodeExpand.state.setNextPlayer = 0;
                nodeExpand.state = nodeExpand.state.applyMove(randomMove);
                isPlayerTurn = nodeExpand.state.getPlayerTurn;
                console.log("State after random move cua nextplayer:", nodeExpand);
            }
            else {
                console.log("Nuoc di con trong:", moves);
                const node = new MCTSNode();
                node.unexploredChildren = moves;
                console.log("Node children 114:", node.children);
                console.log("Node children 115:", node);
                const newMoves = this.selectBestChild(node);
                nodeExpand.state.setPlayerTurn = 0;
                nodeExpand.state.setNextPlayer = 1;
                nodeExpand.state = nodeExpand.state.applyMove(newMoves);
                isPlayerTurn = nodeExpand.state.getPlayerTurn;
            }
            i++;
        }
        return nodeExpand.state.getResult();
    }

    backPropagation (node,result) {
        let i = 0;
        console.log("node moi vao cua backpropagation", node);
        while (node) {
            node.visits++;
            node.wins += result;
            console.log("Backpropagation complete. node:", node," lan:", i);
            node = node.parent;
            console.log("Backpropagation complete. node parent", node," lan:", i);
            console.log("Backpropagation complete. result:", result," lan:", i);
            i++;
        }
        console.log("hoan thanh back", node);
    }
}

export default MCTS;