import * as React from 'react';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

export interface CheckboxItem {
    name: string;
    icon: React.ReactNode;
}

interface MultiCheckboxSelectProps {
    disabled?: boolean;
    items: CheckboxItem[];
    value: CheckboxItem[];
    setValue: (value: CheckboxItem[]) => void;
}

export const MultiCheckboxSelect: React.FC<MultiCheckboxSelectProps> = ({ items, value, setValue, disabled = false }) => {
    return (
        <List
            variant="outlined"
            aria-label="Screens"
            role="group"
            orientation="horizontal"
            sx={{
                flexGrow: 1,
                '--List-gap': '8px',
                padding: '0.3rem',
                '--List-radius': '8px',
            }}
        >
            {items.map((item) => {
                const isChecked = value.some((i) => i.name === item.name);

                return (
                    <ListItem key={item.name} sx={{
                        flexGrow: 1,
                        margin: '0.3rem'
                    }}>
                        <ListItemDecorator
                            sx={[
                                {
                                    zIndex: 2,
                                    pointerEvents: 'none',
                                },
                                isChecked && { color: 'text.primary' },
                            ]}
                        >
                            {item.icon}
                        </ListItemDecorator>
                        <Checkbox
                            disabled={disabled}
                            disableIcon
                            overlay
                            label={item.name}
                            checked={isChecked}
                            color="neutral"
                            variant={isChecked ? 'outlined' : 'plain'}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (event.target.checked) {
                                    setValue([...value, item]);
                                } else {
                                    setValue(value.filter((i) => i.name !== item.name));
                                }
                            }}
                            slotProps={{
                                action: ({ checked }) => ({
                                    sx: {
                                        bgcolor: checked ? 'background.level1' : 'transparent',
                                        boxShadow: checked ? 'sm' : 'none',
                                    },
                                }),
                            }}
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}