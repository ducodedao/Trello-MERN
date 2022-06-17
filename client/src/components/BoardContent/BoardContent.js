import React, { useEffect, useState } from 'react'
import './BoardContent.scss'
import Column from '../Column/Column'
import { initData } from '../../actions/initData'
import { isEmpty } from 'lodash'
import { mapOrder } from '../../utils/mapOrder'
import { Container, Draggable } from 'react-smooth-dnd'

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

    const onColumnDrop = () => {}

    return (
        <div className='board-columns'>
            <Container
                orientation='horizontal'
                onDrop={onColumnDrop}
                getChildPayload={(index) => columns[index]}
                dragHandleSelector='.column-drag-handle'
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview',
                }}
            >
                {columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column column={column} />
                    </Draggable>
                ))}
            </Container>
        </div>
    )
}

export default BoardContent
