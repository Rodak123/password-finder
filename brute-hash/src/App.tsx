import { ListItemDecorator, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { Playground } from "./components/Playground";
import { HandFistIcon, ListIcon, ShovelIcon } from "@phosphor-icons/react";
import { BruteforceBatchHash } from "./components/BruteforceBatchHash";

export const App = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Typography level="h1" sx={{ textAlign: 'center', mb: 2 }}>
                Hasher
            </Typography>

            <Tabs
                defaultValue={0}
                variant="outlined"
                size="lg"
                sx={{
                    flexGrow: 1
                }}
            >
                <TabList>
                    <Tab>
                        <ListItemDecorator>
                            <HandFistIcon />
                        </ListItemDecorator>
                        Bruteforce
                    </Tab>
                    <Tab>
                        <ListItemDecorator>
                            <ShovelIcon />
                        </ListItemDecorator>
                        Playground
                    </Tab>
                </TabList>

                <TabPanel value={0}>
                    <BruteforceBatchHash />
                </TabPanel>

                <TabPanel value={1}>
                    <Playground />
                </TabPanel>
            </Tabs>
        </div>
    );
};