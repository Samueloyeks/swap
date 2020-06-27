
import React,{Component} from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { updateChatBadge } from '../store/actions/index';



 class IconWithBadge extends Component {
    render() {
        const { name, badgeCount, color, size,badgeValue } = this.props;

        return (
            <View style={{ width: 24, height: 24, margin: 5 }}>
                <Ionicons name={name} size={size} color={color} />
                {badgeValue > 0 && (
                    <View
                        style={{
                            position: 'absolute',
                            right: -6,
                            top: -3,
                            backgroundColor: 'red',
                            borderRadius: 6,
                            width: 20,
                            height: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {badgeValue}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
      badgeValue: state.counter.count
    };
  };
  
  
  const mapDispatchToProps = dispatch => {
    return {

    };
  };
  
  export default connect( mapStateToProps, mapDispatchToProps)(IconWithBadge)

