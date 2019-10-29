import {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Picker, 
    Button
} from 'react-native';
import {FAB} from 'react-native-paper';
import React from 'react';
import {
    blocks,
    add,
    addAt,
    swap,
    remove,
    addBlocksChangeListener,
    updateBlock,
    updateRepeatValue,
    updateProgramName,
    refreshPickerItems,
    loadProgramByName,
    addPickerItemsChangeListener,
    addProgramNameChangeListener,
    addLoadedProgramChangeListener
} from '../../../../../stores/BlocksStore';
import ProgramInput from '../../../../controls/ProgramInput';
import { Block } from '../../../../../model/DatabaseModels';
export default class SecondTab extends Component {
    
    // TODO: Replace static text with translated Text!!
    
    state = {
        blocks: blocks,
        programName: "",
        pickerItems: [],
        selected: -1, // index currently selected row
        selectedProgram: {},
        loadedProgram: undefined 
    };

    componentDidMount() {
        refreshPickerItems();
    }

    componentWillUnmount() {
    }

    up = () => {
        let curr = this.state.selected;
        swap(curr, curr - 1);
        this.setState({
            selected: curr - 1,
        });
        return null;
    }
    down = () => {
        let curr = this.state.selected;
        swap(curr, curr + 1);
        this.setState({
            selected: curr + 1,
        });
        return null;
    }

    constructor(props) {
        super(props);
        addPickerItemsChangeListener((items) => {
            this.setState({pickerItems: items});
        });
        addBlocksChangeListener((blocks) => {
           // alert(JSON.stringify(blocks));
            this.setState({blocks: blocks});
        });
        addProgramNameChangeListener((name) => {
            this.setState({programName: name});
        });
        addLoadedProgramChangeListener((program) => {
            this.setState({loadedProgram: program});
        });
    }

    clear(){
        let curr = this.state.selected;
        remove(curr);
        this.setState({selected: curr - 1});
        return;
    }

    render() {
        let select_controls;
        let items = [<Picker.Item label='Select a program'/>];
        this.state.pickerItems.forEach((p) => {
            items.push(<Picker.Item label={p.name} value={p.id} />)
        })
        if (this.state.selected >= 0) {
            select_controls =
                <View>
                    <FAB
                        disabled={blocks.length <= 1}
                        style={styles.delete}
                        icon="delete"
                        onPress={this.clear}
                    />
                    <FAB
                        disabled={this.state.selected === 0}
                        style={styles.move_up}
                        icon="arrow-upward"
                        onPress={this.up}
                    />
                    <FAB
                        disabled={this.state.selected >= blocks.length - 1}
                        style={styles.move_down}
                        icon="arrow-downward"
                        onPress={this.down}
                    />
                </View>
        }

        return (
            <View style={[styles.view, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                <View style={{marginTop: 30, marginBottom:20, height: 40, width: '80%', flexDirection: 'row'}}>
                    <TextInput placeholder='Program name...' style={{textAlign: 'center', flex: 2, height: 40, borderBottomColor: '#828282', borderBottomWidth: 1.0}}  value={this.state.programName} onChangeText = { text => {updateProgramName(text)}}/>
                </View>
                <ScrollView
                    style={{backgroundColor: 'white'}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    scrollEnabled={true}>
                    <FlatList
                        data={this.state.blocks} 
                        extraData={this.state} 
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({item, index}) => (
                        <TouchableOpacity index={index} 
                        style={parseInt(index) == this.state.selected ? styles.selected_row : styles.row}
                        onPress={() => {
                            if (this.state.selected == parseInt(index)) {
                                this.setState({selected: -1});
                            } else {
                                this.setState({selected: parseInt(index)});
                            }
                        }}>
                        <ProgramInput index={index} selected={this.state.selected}
                            pickerItems={items}
                            selectedProgram={this.state.blocks[index].ref}
                            onRepeatValueChange = {(value) => {
                                updateRepeatValue(index, parseInt(value));                     
                                this.setState({
                                    selected: -1,
                                });
                                }
                            }
                            onProgramSelectionChange = {(value) => {
                                updateBlock(index, value);
                                this.setState({
                                     selected: -1,
                                });
                            }}
                            val={parseInt(this.state.blocks[index].rep)}></ProgramInput>
                        </TouchableOpacity>
                    )} />
                </ScrollView>
                <View>
                    <FAB
                        style={styles.fab}
                        icon="add"
                        onPress={() => {
                            let curr = this.state.selected;
                            if (curr == -1) {
                                add( new Block("",1));
                                return;
                            } else {
                                addAt(curr + 1, new Block("",1));
                                return;
                            }
                        }}
                    />
                </View>
                {select_controls}
            </View>
        );
    }

}
const styles = StyleSheet.create({
    row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: 30, 
        paddingVertical: 10,
        backgroundColor: '#FAFAFA'
    },
    selected_row: {
        height: 60,
        margin: 0,
        width: '100%',
        flexDirection: 'row',
        borderColor: '#d6d6d6',
        borderWidth: 1.0,
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: '#FAFAFA'
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
