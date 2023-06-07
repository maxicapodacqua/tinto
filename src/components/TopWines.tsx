import { Box, CardContent, Typography, Card, IconButton, Grid, capitalize, Chip } from "@mui/material";
import { WineMetrics, WineStatModel } from "@/context/database";
import React from "react";

type Props = {
    title: string,
    topWines: WineStatModel[],
    metricIcon: React.ReactNode,
    metricField: keyof WineMetrics,
};
export default function TopWines({ title, topWines, metricIcon, metricField }: Props): JSX.Element {
    return <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontSize={'large'} component="p" gutterBottom>
            {title}
        </Typography>
        <Grid
            wrap="nowrap"
            container
            spacing={3}
            sx={{
                overflowX: 'auto',
            }}
        >
            {topWines.map((w) => (
                <Grid key={w.$id} item>
                    <Box
                    >
                        <Card sx={{ width: 180 }} >
                            <CardContent >
                                <Box sx={{ height: 95, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography variant="subtitle2" component={'div'} fontSize={'large'}>
                                        {w.name}
                                    </Typography>
                                </Box>
                                <Box component={'div'} sx={{ my: 1.5 }} color="text.secondary">
                                    <Chip variant="outlined" label={capitalize(w.type)} />
                                </Box>
                                <IconButton sx={{ p: 0, pr: 0.4, color: "primary.main" }}>
                                    {metricIcon}
                                </IconButton>
                                <Typography variant="caption">{w[metricField]}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
}