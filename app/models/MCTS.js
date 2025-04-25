import MCTSNode from "./MCTSNode";
import gameState from './GameState';
import { select } from "@nextui-org/react";

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
            // console.log("🎲 Simulation Result:", result);
            // console.log("Backpropagation started for node:", newNode);
            // console.log("root hien tai ", this.root);
            this.backPropagation(newNode, result);
            console.log("root sau khi ket thuc ", this.root.unexploredChildren);
            console.log(this.root.children[0] instanceof MCTSNode); // 👉 true hoặc false
            console.log("Running iteration:", i);
            console.log(" sau khi thuc su ket thuc ", this.root);
        }
    }

    addChild(node) {
        const game = new gameState(node.state.board);
        const unexploredMoves = game.getPossibleMoves();
        unexploredMoves.forEach(move => {
            const child = new MCTSNode(move); // Tạo nút con từ nước đi
            child.parent = node; // Thiết lập parent cho nút con
            node.children.push(child); // Thêm nút con vào children
            node.unexploredChildren.push(child); // Thêm nút con vào unexploredMoves
        });
    }

    selectBestChild (node) {
        let bestChild = node.unexploredChildren[0]; // giả sử nút đầu tiên là tốt nhất
        let bestUCB = bestChild.getUCB1();//5 
        console.log("Best child:", bestChild);
        console.log("Best UCB:", bestUCB);
        for (let i = 0; i < node.unexploredChildren.length; i++ ) {
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
    selection() {
        let node = this.root;
        let depth = 0;
        while (node) {
            console.log(`Current depth: ${depth}, Node:`, node);
            // Kiểm tra còn unexplored children không
            if (node.unexploredChildren.length > 0) {
                let bestChild = this.selectBestChild(node)// chọn nút con tốt nhất
                console.log("da chay vao lenh while dong 74", bestChild);
                return bestChild;
            } else {
                const bestVisitedChild = node.children.reduce((best, child) => {
                    if (!best || child.getUCB1() > best.getUCB1()) {
                        return child;
                    }
                    return best;
                }, null);
                if (bestVisitedChild) {
                    console.log('Best visited child details:', {
                        lastMove: bestVisitedChild.state._lastMove,
                        board: bestVisitedChild.state.board,
                        playerTurn: bestVisitedChild.state.getPlayerTurn,
                        nextPlayer: bestVisitedChild.state.getNextPlayer,
                        visits: bestVisitedChild.visits,
                        wins: bestVisitedChild.wins,
                        UCB: bestVisitedChild.getUCB1(),
                        childrenCount: bestVisitedChild.children.length,
                        unexploredCount: bestVisitedChild.unexploredChildren.length
                    });
                    
                    // Nếu node này chưa có con, thêm các node con mới vào unexploredChildren
                    if (bestVisitedChild.children.length === 0) {
                        this.addChild(bestVisitedChild);
                        let child = this.selectBestChild(bestVisitedChild);
                        return child;
                    } 
                }
            }

            // Nếu không thể đi tiếp hoặc quay lui
            if (node.parent) {
                node = node.parent;
                depth--;
                console.log(`Backtracking to depth ${depth}`);
            } else {
                break;
            }
        }
        // dang bi lỗi trả về node gốc nên không tìm thấy state trong expanded vì expanded mình dùng node.parent.state
        console.log("No more nodes to select.");
        return node;
    }


    expansion(node) {
        const newGameState = new gameState(
            node.parent.state.board,
            node.parent.state.getNextPlayer,
            node.parent.state.getPlayerTurn,
            node.parent.state.getLastMove,
        );
        console.log(" moves expansion ", newGameState);
        const nextState = newGameState.applyMove(node);
        console.log(" next state", nextState);
        const childNode = node.parent.children.find(child => child.state === nextState._lastMove.state); // tìm nút con trong children của root
        console.log("child node expansion 89", childNode);
        childNode.state = nextState; // cập nhật state cho nút con
        console.log("child node expansion 91", childNode);
        node.parent.unexploredChildren.splice(node, 1);
        console.log(" children after expansion", node.parent.unexploredChildren);
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
                // const node = new MCTSNode();
                // node.unexploredChildren = moves;
                const node = new MCTSNode(this.root);
                node.unexploredChildren =  moves.map(move => new MCTSNode(move));
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

    backPropagation(node, result) {
        let currentNode = node;
        while (currentNode) {
            // Cập nhật visits và wins của node hiện tại
            currentNode.visits++;
            currentNode.wins += result;
            
            // Cập nhật UCB cho các node con đã được thăm
            if (currentNode.children && currentNode.children.length > 0) {
                currentNode.children.forEach(childNode => {
                    if (childNode && childNode.visits > 0) {
                        // Chuyển UCB thành float và làm tròn đến 4 chữ số thập phân
                        childNode.ucb = parseFloat(childNode.getUCB1().toFixed(4));
                        console.log("Updated visited child UCB:", {
                            childState: childNode.state,
                            childVisits: childNode.visits,
                            childWins: childNode.wins,
                            newUCB: childNode.ucb,
                            ucbType: typeof childNode.ucb // Kiểm tra kiểu dữ liệu
                        });
                    }
                });
            }
            
            currentNode = currentNode.parent;
        }
        
    }
}

export default MCTS;