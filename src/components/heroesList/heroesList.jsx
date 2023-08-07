import "./heroesList.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import HeroListItem from "../heroListCard/heroListCard";
import { fetching, fetched, changeFilter } from "../../redux/reducers";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useChampionService from "../../services/championsService";

const HeroList = () => {
  const filterButton = ["all", "assassin", "mage", "tank", "marksman"];
  const { getChampionList } = useChampionService();
  const dispatch = useDispatch();
  const roleRef = useRef([]);
  const { filterStatus } = useSelector((state) => state);

  const filterChampion = useSelector((state) => {
    if (filterStatus === "all") {
      return state.champions;
    } else {
      return state.champions.filter((item) => item.role === filterStatus);
    }
  });

  const focusRole = (id) => {
    roleRef.current.forEach((item) => {
      item.classList.remove("role-active");
    });
    roleRef.current[id].classList.add("role-active");
  };

  useEffect(() => {
    dispatch(fetching());
    getChampionList().then((data) => dispatch(fetched(data))); // eslint-disable-next-line
  }, []);

  const elem = filterChampion.map(({ id, name, img }) => (
    <CSSTransition key={id} classNames="fade" timeout={500}>
      <HeroListItem name={name} img={img} id={id} />
    </CSSTransition>
  ));

  return (
    <>
      <div className="container">
        <div className="banner">
          <div className="banner__text">
            <h1 className="banner__title">
              <span>Choose your</span>
              <div className="banner__champion">champion</div>
            </h1>
          </div>
          <div className="banner__description">
            With more than 140 champions, you’ll find the perfect match for your
            playstyle. Master one, or master them all.
          </div>
        </div>

        <div className="filter">
          {filterButton.map((item, i) => {
            const active =
              i === 0 ? "filter__button role-active" : "filter__button";
            return (
              <button
                ref={(el) => (roleRef.current[i] = el)}
                key={i}
                className={active}
                onClick={() => {
                  dispatch(changeFilter(item));
                  focusRole(i);
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        <TransitionGroup className="cards">{elem}</TransitionGroup>
      </div>
    </>
  );
};

export default HeroList;
