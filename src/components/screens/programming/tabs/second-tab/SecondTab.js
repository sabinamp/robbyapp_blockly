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
        selected: -1, // id of currently selected row
        selectedProgram: {},
        loadedProgram: undefined 
    };

    componentDidMount() {
        refreshPickerItems();
    }

    componentWillUnmount() {
    }

    constructor(props) {
        super(props);
        addPickerItemsChangeListener((items) => {
            this.setState({pickerItems: items});
        });
        addBlocksChangeListener((blocks) => {
            this.setState({blocks: blocks});
        });
        addProgramNameChangeListener((name) => {
            this.setState({programName: name});
        });
        addLoadedProgramChangeListener((program) => {
            this.setState({loadedProgram: program});
        });
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
                        onPress={() => {
                            let curr = this.state.selected;
                            alert(curr);
                            remove(curr);
                            this.setState({selected: curr - 1});
                        }}
                    />
                    <FAB
                        disabled={this.state.selected == 0}
                        style={styles.move_up}
                        icon="arrow-upward"
                        onPress={() => {
                            let curr = this.state.selected;
                            alert(curr);
                            swap(curr, curr - 1);
                            this.setState({
                                selected: curr - 1,
                            });
                        }}
                    />
                    <FAB
                        disabled={this.state.selected >= blocks.length - 1}
                        style={styles.move_down}
                        icon="arrow-downward"
                        onPress={() => {   
                            let curr = this.state.selected;
                            alert(curr);
                            swap(curr, curr + 1);
                            this.setState({
                                selected: curr + 1,
                            });
                        }}
                    />
                </View>
        }

        return (
            <View style={[styles.view, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                <View style={{marginTop: 30, marginBottom:20, height: 40, width: '80%', flexDirection: 'row'}}>
                    <TextInput placeholder='Program name...' style={{textAlign: 'center', flex: 2, height: 40, borderBottomColor: '#828282', borderBottomWidth: 1.0}}  value={this.state.programName} onChangeText = { text => this.setState({programName: text})}/>
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
                        <TouchableOpacity
                        style={{paddingHorizontal: 30, paddingVertical: 10}}
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
                        <Button title="Load" onPress={()=>{
                            loadProgramByName("Model4");
                        }} />
                </ScrollView>
                <View>
                    <FAB
                        style={styles.fab}
                        icon="add"
                        onPress={() => {
                            let curr = this.state.selected;
                            if (curr == -1) {
                                add( new Block(undefined,1));
                            } else {
                                addAt(curr + 1, new Block(undefined,1));
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
