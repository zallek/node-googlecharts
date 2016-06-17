# Google Charts for Node

### Requierements
- ICU4C

### Dev
```SH
npm run run
```

### Run
You must set the env variable `NODE_ICU_DATA` to the folder containing your `icudt**.dat` file.
```SH
node bin/node-googlecharts <ChartWrapperOptions>
```

`ChartWrapperOptions` is the serialized JSON options to give to `ChartWrapper`.
