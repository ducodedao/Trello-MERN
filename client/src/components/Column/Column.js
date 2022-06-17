import React, { useEffect, useRef, useState } from 'react'
import './Column.scss'
import Card from '../Card/Card'
import { mapOrder } from '../../utils/mapOrder'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown } from 'react-bootstrap'
import ConfirmModal from '../../common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from '../../utils/constants'
import { Form, Button } from 'react-bootstrap'
import {
    saveContentAfterPressEnter,
    selectAllInlineText,
} from '../../utils/editable'
import { cloneDeep } from 'lodash'

const Column = (props) => {
    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal)

    const [columnTitle, setColumnTitle] = useState('')
    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value, [])

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextAreaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')

    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    useEffect(() => {
        if (newCardTextAreaRef && newCardTextAreaRef.current) {
            newCardTextAreaRef.current.focus()
            newCardTextAreaRef.current.select()
        }
    }, [openNewCardForm])

    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true,
            }

            onUpdateColumn(newColumn)
        }

        toggleConfirmModal()
    }

    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle,
        }

        onUpdateColumn(newColumn)
    }

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextAreaRef.current.focus()
            return
        }

        const newCardToAt = {
            id: Math.random().toString(36).substr(2, 5),
            boardId: column.boardId,
            columnId: column.id,
            title: newCardTitle.trim(),
            cover: null,
        }

        let newColumn = cloneDeep(column)
        newColumn.cards.push(newCardToAt)
        newColumn.cardOrder.push(newCardToAt.id)

        onUpdateColumn(newColumn)
        setNewCardTitle('')
        toggleOpenNewCardForm()
    }

    return (
        <div className='column'>
            <header className='column-drag-handle'>
                <div className='column-title'>
                    <Form.Control
                        size='sm'
                        type='text'
                        className='editable'
                        value={columnTitle}
                        onChange={handleColumnTitleChange}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterPressEnter}
                        onClick={selectAllInlineText}
                        onMouseDown={(e) => {
                            e.preventDefault()
                        }}
                        spellCheck='false'
                    />
                </div>
                <div className='column-actions'>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant='success'
                            id='dropdown-basic'
                            size='sm'
                            className='dropdown-btn'
                        />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={toggleOpenNewCardForm}>
                                Add card
                            </Dropdown.Item>
                            <Dropdown.Item onClick={toggleConfirmModal}>
                                Remove column
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Move all cards in the column
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className='card-list'>
                <Container
                    groupName='col'
                    orientation='vertical'
                    onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
                    getChildPayload={(index) => cards[index]}
                    dragClass='card-ghost'
                    dropClass='card-ghost-drop'
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview',
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card} />
                        </Draggable>
                    ))}
                </Container>

                {openNewCardForm && (
                    <div className='add-new-card'>
                        <Form.Control
                            size='sm'
                            as='textarea'
                            row='3'
                            placeholder='Enter a title for this card'
                            className='input-new-card'
                            ref={newCardTextAreaRef}
                            value={newCardTitle}
                            onChange={onNewCardTitleChange}
                            onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
                        />
                    </div>
                )}
            </div>

            <footer>
                {openNewCardForm && (
                    <div>
                        <Button
                            variant='success'
                            size='sm'
                            onClick={addNewCard}
                        >
                            Add card
                        </Button>
                        <span
                            className='cancel'
                            onClick={toggleOpenNewCardForm}
                        >
                            <i className='fa fa-times icon'></i>
                        </span>
                    </div>
                )}

                {!openNewCardForm && (
                    <div
                        className='footer-actions'
                        onClick={toggleOpenNewCardForm}
                    >
                        <i className='fa fa-plus icon' />
                        Add another card
                    </div>
                )}
            </footer>

            <ConfirmModal
                show={showConfirmModal}
                onAction={onConfirmModalAction}
                title='Remove column'
                content={`Are you sure want to remove <strong>${column.title}</strong>.<br/>All related cards will also be removed!`}
            />
        </div>
    )
}

export default Column
