// onKeyDown
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        e.target.blur()
    }
}

// Select all inline text
export const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
}
