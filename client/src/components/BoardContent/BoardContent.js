import React, { useCallback, useEffect, useRef, useState } from 'react'
import './BoardContent.scss'
import Column from '../Column/Column'
import { initData } from '../../actions/initData'
import { isEmpty } from 'lodash'
import { mapOrder } from '../../utils/mapOrder'
import { Container, Draggable } from 'react-smooth-dnd'
import { applyDrag } from '../../utils/applyDrag'
import { Form, Button, Col, Row } from 'react-bootstrap'

const BoardContent = () => {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    const newColumnInputRef = useRef(null)

    const onNewColumnTitleChange = useCallback(
        (e) => setNewColumnTitle(e.target.value),
        [],
    )

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

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus()
            newColumnInputRef.current.select()
        }
    }, [openForm])

    if (isEmpty(board)) {
        return <div className='not-found'>Board not found</div>
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map((c) => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (
            dropResult.removedIndex !== null ||
            dropResult.addedIndex !== null
        ) {
            let newColumns = [...columns]
            let currentColumn = newColumns.find((c) => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map((i) => i.id)

            setColumns(newColumns)
        }
    }

    const toggleForm = () => setOpenForm(!openForm)

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }

        const newColumnToAt = {
            id: Math.random().toString(36).substr(2, 5),
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: [],
        }

        let newColumns = [...columns]
        newColumns.push(newColumnToAt)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map((c) => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
        setNewColumnTitle('')
        toggleForm()
    }

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
                        <Column column={column} onCardDrop={onCardDrop} />
                    </Draggable>
                ))}
            </Container>

            {!openForm && (
                <div className='add-new-column' onClick={toggleForm}>
                    <i className='fa fa-plus icon' />
                    Add new column
                </div>
            )}

            {openForm && (
                <Row>
                    <Col className='enter-new-column'>
                        <Form.Control
                            size='sm'
                            type='text'
                            placeholder='Enter new column'
                            className='input-new-column'
                            ref={newColumnInputRef}
                            value={newColumnTitle}
                            onChange={onNewColumnTitleChange}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && addNewColumn()
                            }
                        />
                        <Button
                            variant='success'
                            size='sm'
                            onClick={addNewColumn}
                        >
                            Add column
                        </Button>
                        <span className='cancel' onClick={toggleForm}>
                            <i className='fa fa-times icon'></i>
                        </span>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default BoardContent
