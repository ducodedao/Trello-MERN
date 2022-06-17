import React, { useEffect, useState } from 'react'
import './BoardContent.scss'
import Column from '../Column/Column'
import { initData } from '../../actions/initData'
import { isEmpty } from 'lodash'
import { mapOrder } from '../../utils/mapOrder'

const BoardContent = () => {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initData.boards.find(
            (board) => board.id === 'board-1',
        )

        if (boardFromDB) {
            setBoard(boardFromDB)

            setColumns(
                mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'),
            )
        }
    }, [])

    if (isEmpty(board)) {
        return <div className='not-found'>Board not found</div>
    }

    return (
        <div className='board-columns'>
            {columns.map((column, index) => (
                <Column key={index} column={column} />
            ))}
        </div>
    )
}

export default BoardContent
