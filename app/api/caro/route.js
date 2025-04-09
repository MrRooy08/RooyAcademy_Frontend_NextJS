import { NextResponse } from 'next/server';
import MCTS from './../../models/MCTS';
import MCTSNode from './../../models/MCTSNode';
import GameState from "./../../models/GameState";

export async function POST(request) {
    try {
        const jsonGameState = await request.json();
        console.log("Dữ liệu JSON từ request:", jsonGameState, "board", jsonGameState.node.board); 
        console.log("Dữ liệu last move",jsonGameState.node._lastMove); 
        console.log("Dữ liệu _isPlayerTurn",jsonGameState.node._isPlayerTurn); 
        console.log("Dữ liệu _nextPlayer",jsonGameState.node._nextPlayer); 
        const gameState = GameState.fromJSON(jsonGameState.node); // Tạo instance GameState từ JSON
        console.log("Dữ liệu GameState sau khi chuyển đổi:", gameState);
        const mcts = new MCTS(gameState);
        mcts.run(1);

        const bestMoveNode = mcts.root.selectBestChild();
        console.log("Best move node:", bestMoveNode.state.lastMove);
        return NextResponse.json({
            move : bestMoveNode.state.lastMove
        });

    } catch (error) {
        console.error('Error in /api/caro/route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } 
}