// "use client";
// import { useState, useEffect, useRef } from 'react';
// import GameState from '../models/GameState';

// export default function CaroGame() {
//     const [winner, setWinner] = useState(null);
//     const [isPlayerTurn, setIsPlayerTurn] = useState(1); // nước đi này của ai 
//     const [nextPlayer, setNextPlayer] = useState(null); // người chơi tiếp theo
//     const [isAILoading, setIsAILoading] = useState(false);
//     const [gameState, setGameState] = useState(new GameState());

//     const handleAIMove = async () => {
//         if (isPlayerTurn || !isAILoading) return; // Kiểm tra đây là lượt của User nên AI không được chơi 
//         setIsAILoading(true);
//         try {
//             const response = await fetch("/api/caro", {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ node: gameState }),
//             });
//             const data = await response.json();
//             console.log("du lieu data handleAIMove", data);
//             setGameState(prevState => prevState.applyMove(data.move));
//             setBoard(data.board);
//         } catch (error) {
//             console.error("Error in AI move:", error);
//         } finally {
//             setIsAILoading(false);
//             setIsPlayerTurn(1);
//         }
//     };

//     const handleClick = (i, j) => {
//         if ( !isPlayerTurn || isAILoading ) return;
//         console.log("Current gameState:", gameState);
//         const newState = gameState.applyMove([i, j]);
//         setGameState(newState.board, newState._nextPlayer, newState.getNextPlayer, newState.move);
//         setBoard(newState.board);
//         setIsPlayerTurn(newState._nextPlayer);
//         setNextPlayer(newState.getNextPlayer);
//         isLastMove(newState.move);
//         setIsAILoading(true); // Bắt đầu AI suy nghĩ sau khi người chơi đánh
//         console.log("Ban co sau khi di trong caro.jsx:", newState.board);
//         console.log("Nuoc di cuoi:", newState._lastMove);
//         console.log(" luot choi cua", newState.getPlayerTurn);
//         console.log(" luot choi tiep theo", isPlayerTurn);
//     };


//     useEffect(() => {
//         if (isPlayerTurn === 0 && isAILoading){
//             handleAIMove(); // Gọi hàm AI khi lượt của AI
//         }
//     },[]);

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <h1 className="text-3xl font-bold mb-4">Cờ Caro - AI Tự Chơi</h1>
//             <p className="mb-4 text-lg">
//                 {isAILoading ? "AI đang suy nghĩ..." : `Lượt của: ${isPlayerTurn ? "Người chơi" : "AI"}`}
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)' }}>
//                 {gameState?.board?.map((row, i) =>
//                     row?.map((cell, j) => (
//                         <div
//                             key={`${i}-${j}`}
//                             style={{ width: 40, height: 40, border: '1px solid #ddd', textAlign: 'center', lineHeight: '40px', cursor: 'pointer' }}
//                             onClick={() => handleClick(i, j)}
//                         >
//                             {cell != null ? cell : "0"}
//                         </div>
//                     ))
//                 )}
//             </div>
//             {winner && <p className="mt-4 text-xl text-green-600">{winner} thắng!</p>}
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from 'react';
import GameState from '../models/GameState';

export default function CaroGame() {
    const [winner, setWinner] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(1); // 1: Player, 0: AI
    const [isAILoading, setIsAILoading] = useState(false);
    const [gameState, setGameState] = useState(new GameState());

    const handleAIMove = async () => {
        if (isPlayerTurn || !isAILoading) return; // Kiểm tra lượt và trạng thái tải
        setIsAILoading(true);
        console.log("da chay vao handleAIMove");
        try {
            const response = await fetch("/api/caro", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ node: gameState }),
            });
            const data = await response.json();
            console.log("du lieu data handleAIMove", data);
            setGameState(prevState => prevState.applyMove(data.move));
        } catch (error) {
            console.error("Error in AI move:", error);
        } finally {
            setIsAILoading(false);
            setIsPlayerTurn(1); // Chuyển lượt lại cho người chơi
        }
    };

    const handleClick = (i, j) => {
        if (!isPlayerTurn || isAILoading || gameState.board[i][j]) return; // Kiểm tra lượt, trạng thái tải và ô đã chọn

        const newState = gameState.applyMove([i, j]);
        setGameState(newState);
        setIsPlayerTurn(0); // Chuyển lượt cho AI
        setIsAILoading(true); // Bắt đầu AI suy nghĩ

        console.log("Ban co sau khi di trong caro.jsx:", newState.board);
        console.log("Nuoc di cuoi:", newState.lastMove);
        console.log("luot choi cua", newState.currentPlayer);
        console.log("luot choi tiep theo", newState.nextPlayer);

        if (newState.isTerminal()) {
            const winner = newState.getWinner();
            if (winner) {
                setWinner(winner);
            }
        }
    };

    useEffect(() => {
        if (isPlayerTurn === 0 && isAILoading) {
            console.log("AI đang suy nghĩ...");
            handleAIMove(); // Gọi hàm AI khi lượt của AI
        }
    }, [isPlayerTurn, isAILoading, gameState]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Cờ Caro - AI Tự Chơi</h1>
            <p className="mb-4 text-lg">
                {isAILoading ? "AI đang suy nghĩ..." : `Lượt của: ${isPlayerTurn ? "Người chơi" : "AI"}`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)' }}>
                {gameState?.board?.map((row, i) =>
                    row?.map((cell, j) => (
                        <div
                            key={`${i}-${j}`}
                            style={{ width: 40, height: 40, border: '1px solid #ddd', textAlign: 'center', lineHeight: '40px', cursor: 'pointer' }}
                            onClick={() => handleClick(i, j)}
                        >
                            {cell != null ? cell : "0"}
                        </div>
                    ))
                )}
            </div>
            {winner && <p className="mt-4 text-xl text-green-600">{winner} thắng!</p>}
        </div>
    );
}