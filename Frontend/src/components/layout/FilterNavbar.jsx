import { AppBar, Box, Toolbar, Typography, Chip, Select } from '@mui/material';
import { useState } from 'react';

function FilterNavbar({ tags }) {

    const [selectedTag, setSelectedTag] = useState(null);

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
    };

    const options = tags;

    return (
        <Box>
            <AppBar position="static" sx={{
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: 'background.default',
                color: 'text.secondary',
            }}>
                <Toolbar>
                    <Chip label="Todos" onClick={() => handleTagClick(null)} />
                    {options.map(tag => (
                        <Chip label={tag} onClick={() => handleTagClick(tag)} sx={{
                            backgroundColor: selectedTag === tag ? 'primary.main' : 'background.default',
                            color: selectedTag === tag ? 'primary.contrastText' : 'text.secondary',
                            fontWeight: 'bold',
                        }}/>
                    ))}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default FilterNavbar;
