import {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Picker
} from 'react-native';
import {FAB} from 'react-native-paper';
import React from 'react';
import {
    speeds,
    addSpeedChangeListener,
    //storeSpeeds,
    //retrieveSpeeds
} from '../../../../../stores/SpeedsStore';
import i18n from '../../../../../../resources/locales/i18n';
import NumericInput from './NumericInput';
import ProgramInput from './ProgramInput';

export default class SecondTab extends Component {
    state = {
        programs: ['Zickzack', '--------------Circle-------------------', 'Angle'],
        selected: -1, // id of currently selected row
        selectedProgram: {},
        values: {"0": 0, "1": 0, "2": 0},
    };

    componentDidMount() {
        //retrieveSpeeds;
    }

    componentWillUnmount() {
        //storeSpeeds;
    }

    constructor(props) {
        super(props);
        addSpeedChangeListener((speeds) => {
            this.setState({speeds: speeds});
        });
    }

    render() {
        let select_controls;
        let pickerItems = [<Picker.Item label='Select a program' valeu='novalue'/>];
        this.state.programs.forEach((p) => {
            pickerItems.push(<Picker.Item label={p} value={p} />)
        })
        if (this.state.selected >= 0) {
            select_controls =
                <View>
                    <FAB
                        disabled={speeds.length <= 1}
                        style={styles.delete}
                        icon="delete"
                        onPress={() => {
                        }}
                    />
                    <FAB
                        disabled={this.state.selected == 0}
                        style={styles.move_up}
                        icon="arrow-upward"
                        onPress={() => {
                            
                        }}
                    />
                    <FAB
                        disabled={this.state.selected >= speeds.length - 1}
                        style={styles.move_down}
                        icon="arrow-downward"
                        onPress={() => {   
                        }}
                    />
                </View>;
        }

        return (
            <View style={[styles.view, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                <View style={{marginTop: 30, marginBottom:20, height: 20, width: '100%', flexDirection: 'row'}}>
                    <Text style={{textAlign: 'center', flex: 2}}> Some text here </Text>
                </View>
                <ScrollView
                    style={{backgroundColor: 'white'}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    scrollEnabled={true}>
                    <FlatList 
                        data={this.state.programs} 
                        extraData={this.state} 
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({item, index}) => (
                        <TouchableOpacity
                        style={{paddingHorizontal: 30, paddingVertical: 10}}
                        onPress={() => {
                            if (this.state.selected == parseInt(index)) {
                                this.setState({selected: -1});
                            } else {
                                this.setState({selected: parseInt(index)});
                            }
                        }}>
                        <ProgramInput index={index} 
                            pickerItems={pickerItems} 
                            onchange={(value)=>{
                                var values = this.state.values; 
                                values[index] = parseInt(value); 
                                this.setState({values: values});}
                            } 
                            val={parseInt(this.state.values[index])}></ProgramInput>
                        </TouchableOpacity>
                    )} />
                    
                </ScrollView>
                <View>
                    <FAB
                        style={styles.fab}
                        icon="add"
                        onPress={() => {
                        }}
                    />
                </View>
                {select_controls}
            </View>
        );
    }

}
const styles = StyleSheet.create({
    col: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        margin: 5,
    },
    row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
    },
    selected_row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        borderColor: '#d6d6d6',
        borderWidth: 1.0,
    },
    view: {
        marginBottom: 55,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: -200,
        bottom: 18,
    },
    delete: {
        position: 'absolute',
        margin: 16,
        right: -105,
        bottom: 18,
    },
    move_up: {
        position: 'absolute',
        margin: 16,
        right: -30,
        bottom: 18,
    },
    move_down: {
        position: 'absolute',
        margin: 16,
        right: 45,
        bottom: 18,
    },
    numinput: {
        justifyContent: 'center',
        zIndex: 1,
        flexDirection: 'row',
        width: '30%',
        height: '70%',
    },
});
