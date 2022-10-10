import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchGenres } from '../../../../api/explore';
import { Genre } from '../../../../models/genre';
import { disableLoading, enableLoading } from '../../../../redux/modules/loading/actions';
import { SquareItem } from '../../../../shared/components/flatlist/square-item';
import OnlineScreen from '../../../../shared/components/online-screen';
import { Screen } from '../../../../shared/constance/screen';
import { styles } from './styles';

interface Props extends DispatchProps {
  navigation: any;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  };
};

const GenreListScreen: React.FunctionComponent<Props> = (props: Props) => {
  const {
    navigation,
    enableLoading,
    disableLoading,
  } = props;

  const [genres, setGenres] = useState<Array<Genre>>(null);

  useEffect(() => {
    enableLoading();

    fetchGenres()
      .then((data) => {
        disableLoading();
        setGenres(data.genres);
      })
      .catch((err) => {
        console.log(err);
        disableLoading();
      });
  }, []);

  return (
    <>
      <OnlineScreen>
        <FlatList
          contentContainerStyle={styles.genreList}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          initialNumToRender={2}
          columnWrapperStyle={styles.columnWrapper}
          data={genres}
          renderItem={({item}) => {
            return (
              <SquareItem
                name={item.name}
                image={item.image_url}
                onClick={() =>
                  navigation.navigate(Screen.Explore.GenreDetail, {
                    genre: item,
                  })
                }
                size={2}
              />
            );
          }}
          keyExtractor={(item) => item.genre_id.toString()}
        />
      </OnlineScreen>
    </>
  );
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GenreListScreen);
