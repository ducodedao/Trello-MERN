import React from 'react'
import './Column.scss'
import Card from '../Card/Card'

const Column = () => {
    return (
        <div className='column'>
            <header>Brainstorm</header>
            <ul className='card-list'>
                <Card />
                <li className='card-item'>Lorem ipsum dolor sit amet.</li>
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}

export default Column
